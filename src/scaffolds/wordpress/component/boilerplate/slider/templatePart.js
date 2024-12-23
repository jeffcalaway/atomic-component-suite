const format   = require('../../../../../utils/format');
const syntax   = require('../../../../../utils/syntax');
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
        'Select the type of component that this component slides through'
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
        'Select Component',
        'Select the component that this component slides through'
    );

    if (!singleComponent) return;

    let isListComponent = 'No';
    isListComponent = await prompts.confirm('Is this a list component?', { modal: true });
    let props = null;
    let requiredProps = null;

    if (isListComponent == 'No') {
        const componentPath = path.join(componentTypePath, singleComponent.value, singleComponent.value + '.php');

        const propList = fileUtil.getProps(componentPath);

        props = [];
        props = await prompts.pickMany(propList, 'Select Item Props', 'Select the props to pass to each slide');

        requiredProps = [];
        if (props) {
            requiredProps = await prompts.pickMany(props, 'Select Required Props', 'Select the props that are required for the slide to render');
        }
    }

    const folderName   = syntax.getName(file);
    const singularName = format.toSingular(folderName);
    const words        = singularName.split("-");
    let   elementName  = 'list';
    
    if (isListComponent == 'No') {
        elementName = words.pop();
        elementName = format.toSingular(elementName);
        elementName = await prompts.input('Enter a name for the element', `e.g, component__ELEMENT-NAME`);
    }

    return {
        type: componentType.value,
        slug: singleComponent.value,
        props,
        requiredProps,
        elementName,
        isListComponent
    };
}

const fileContent = function (file, component) {
    const folderName = syntax.getName(file);
    const dirName    = syntax.getDirName(file);
    const dirLetter  = format.toFirstLetter(dirName);
  
    const className = `${dirLetter}-${folderName}`;
    let list;
  
    let componentTemplate = 'molecules/MOLECULE_NAME';

    if (component) {
        componentTemplate = `${component.type}/${component.slug}`;
    }

    if (!component || component.isListComponent == 'Yes') {
        list = `              <?php render_template_part('${componentTemplate}', [
                  'class' => '${className}__list',
                  'items' => $items
              ]); ?>`;
    } else {
        let arrayOnlyKeys     = '                        ';
        let conditionalStart  = '\n';
        let conditionalEnd    = '';
        let conditionalIndent = '    ';

        if (component) {
            arrayOnlyKeys = component.props.map((prop) => {
                return `\n                            '${prop}'`;
            }).join(',');
    
            if (component.requiredProps.length) {
                const requiredItems = component.requiredProps.map((prop) => {
                    return `$item['${prop}']`;
                }).join(' && ');
                conditionalStart = `\n                    <?php if ( ${requiredItems} ) : ?>`;
                conditionalEnd = '\n                    <?php endif; ?>';
            }
        }

        list = `            <ul class="${className}__list">

                <?php foreach ( $items as $item ) : ?>

                    <?php
                        $keys = [${arrayOnlyKeys}
                        ];
                        $item = array_only($item, $keys, null);
                    ?>${conditionalStart}
                    ${conditionalIndent}<li class="${className}__item">
                    ${conditionalIndent}    <?php render_template_part('${componentTemplate}', array_merge($item, [
                    ${conditionalIndent}        'class' => '${className}__${component.elementName}'
                    ${conditionalIndent}    ])); ?>
                    ${conditionalIndent}</li>${conditionalEnd}

                <?php endforeach; ?>
            </ul>`;
    }
  
    return `<?php
    $props->admit_props([
        'id',
        'items'
    ]);

    $props->set_attributes([
        'id'
    ]);

    extract($props->to_array());

    $class = $props->class([
        '${className}'
    ]);
?>

<?php if ( $items ) : ?>
    <section
        <?php echo $id_attr; ?>
        class="<?php echo $class; ?>"
    >
        <div class="${className}__container u-container">
${list}
        </div>
    </section>
<?php endif; ?>`;
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}