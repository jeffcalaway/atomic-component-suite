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
        'Select the type of component that this component loops through'
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
        'Select the component that this component loops through'
    );

    if (!singleComponent) return;

    const componentPath = path.join(componentTypePath, singleComponent.value, singleComponent.value + '.php');

    const propList = fileUtil.getProps(componentPath);

    let props = [];
    props = await prompts.pickMany(propList, 'Select Item Props', 'Select the props to pass to the item in the loop');

    let requiredProps = [];
    if (props) {
        requiredProps = await prompts.pickMany(props, 'Select Required Props', 'Select the props that are required for the item to render');
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
  
  const singularName    = format.toSingular(folderName);
  let itemPath          = `molecules/${singularName}`;
  let arrayOnlyKeys     = '                        ';
  let conditionalStart  = '\n';
  let conditionalEnd    = '';
  let conditionalIndent = '';

  if (component) {
    itemPath = `${component.type}/${component.slug}`;

    arrayOnlyKeys = component.props.map((prop) => {
        return `\n                        '${prop}'`;
    }).join(',');

    if (component.requiredProps.length) {
        const requiredItems = component.requiredProps.map((prop) => {
            return `$item['${prop}']`;
        }).join(' && ');
        conditionalStart  = `\n\n                <?php if ( ${requiredItems} ) : ?>`;
        conditionalEnd    = '\n                <?php endif; ?>';
        conditionalIndent = '    ';
    }
  }

  return `<?php
    $props->admit_props([
        'items'
    ]);

    extract($props->to_array());

    $class = $props->class([
        '${className}'
    ]);
?>

<?php if ( $items ) : ?>
    <div class="<?php echo $class; ?>">
        <ul class="${className}__list">
            <?php foreach ( $items as $item ) : ?>

                <?php
                    $keys = [${arrayOnlyKeys}
                    ];
                    $item = array_only($item, $keys, null);
                ?>${conditionalStart}
                ${conditionalIndent}<li class="${className}__item">
                ${conditionalIndent}    <?php render_template_part('${itemPath}', array_merge($item, [
                ${conditionalIndent}        'class' => '${className}__${component.elementName}'
                ${conditionalIndent}    ])); ?>
                ${conditionalIndent}</li>${conditionalEnd}

            <?php endforeach; ?>
        </ul>
  </div>
<?php endif; ?>`;
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}