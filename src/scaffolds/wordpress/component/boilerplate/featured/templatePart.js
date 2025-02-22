const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');
const prompts  = require('../../../../../utils/prompts');
const fileUtil = require('../../../../../utils/file');
const path     = require('path');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.php`;
}

const filePrompt = async function (file, passedValue = false) {
    if (passedValue) return passedValue;
    
    const componentType = await prompts.pickOne(
        [
            {
                label: 'Atom',
                value: 'atoms'
            },
            {
                label: 'Molecule',
                value: 'molecules'
            },
            {
                label: 'Organism',
                value: 'organisms'
            }
        ],
        'Select Component Type',
        'Select the type of component that this component features'
    );

    if (!componentType) return;

    const folderPath        = file.fsPath;
    const partsDirectory    = path.dirname(path.dirname(folderPath));
    const componentTypePath = path.join(partsDirectory, componentType.value);

    const componentFolders = fileUtil.getDirectories(componentTypePath);

    if (!componentFolders) {
        return await prompts.notification('No components found in the selected directory');
    }

    const singleComponent = await prompts.pickOne(
        componentFolders.map(folder => ({
            label: format.toCapsAndSpaces(folder.replace('cta', 'CTA')),
            value: folder
        })),
        'Select Featured Component',
        'Select the component that this component features'
    );

    if (!singleComponent) return;

    const componentPath = path.join(componentTypePath, singleComponent.value, singleComponent.value + '.php');

    let propList = fileUtil.getProps(componentPath).filter(prop => prop !== 'id');

    let props = [];
    props = await prompts.pickMany(propList, 'Select Props', 'Select the props to pass to the featured component');

    let requiredProps = [];
    if (props) {
        requiredProps = await prompts.pickMany(props, 'Select Required Props', 'Select the props that are required for the component to render');
    }

    const folderName   = syntax.getName(file);
    const singularName = format.toSingular(folderName);
    const words        = singularName.split("-");
    let   elementName  = words.pop();
          elementName  = format.toSingular(elementName);

    elementName = await prompts.input('Enter a name for the element', `e.g, component__ELEMENT-NAME`);

    return {
        type: componentType.value,
        slug: singleComponent.value,
        props,
        requiredProps,
        elementName
    };
}

const fileContent = function (file, component) {
    const folderName = syntax.getName(file);
    const dirName    = syntax.getDirName(file);
    const dirLetter  = format.toFirstLetter(dirName);

    const className = `${dirLetter}-${folderName}`;

    const componentName   = folderName.replace('featured-','');
    const words           = componentName.split("-");
    let elementType       = 'molecules';
    let elementName       = words.pop();
        elementName       = format.toSingular(elementName);
    let componentTemplate = `${elementType}/${componentName}`;
    let propsList         = "        'id'";
    let args              = '';
    let conditionalStart  = '';
    let conditionalEnd    = '';
    let conditionalIndent = '';

    if (component) {
        elementType = component.type;
        elementName = component.elementName;
        componentTemplate = `${elementType}/${component.slug}`;

        if (component.requiredProps.length) {
            const requiredItems = component.requiredProps.map((prop) => {
                return `$${prop}`;
            }).join(' && ');
            conditionalStart  = `<?php if ( ${requiredItems} ) : ?>\n`;
            conditionalEnd    = '\n<?php endif; ?>';
            conditionalIndent = '    ';
        }

        if (component.props && component.props.length) {
            propsList = propsList + ',' + component.props.map((prop) => {
                return `\n        '${prop}'`;
            }).join(',');

            const longestPropNameLength = component.props.length
                ? Math.max(...component.props.map(prop => prop.length))
                : 2;
            args = ',' + component.props.map(prop => {
                const propPadded = `'${prop}'`.padEnd(longestPropNameLength + 2);
                return `\n${conditionalIndent}            ${propPadded} => $${prop}`;
            }).join(',');
        }
    }

    return `<?php
    $props->admit_props([
${propsList}
    ]);

    $props->set_attributes([
        'id'
    ]);

    extract($props->to_array());

    $class = $props->class([
        '${className}'
    ]);
?>

${conditionalStart}${conditionalIndent}<section
${conditionalIndent}    <?php echo $id_attr; ?>
${conditionalIndent}    class="<?php echo $class; ?>"
${conditionalIndent}>
${conditionalIndent}    <div class="${className}__container u-container">
${conditionalIndent}        <?php render_template_part('${componentTemplate}', [
${conditionalIndent}            'class' => '${className}__${elementName}'${args}
${conditionalIndent}        ]); ?>
${conditionalIndent}    </div>
${conditionalIndent}</section>${conditionalEnd}`;
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}