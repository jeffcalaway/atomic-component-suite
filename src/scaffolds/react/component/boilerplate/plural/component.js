const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');
const prompts  = require('../../../../../utils/prompts');
const fileUtil = require('../../../../../utils/file');
const path     = require('path');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.js`;
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

    const folderPath          = file.fsPath;
    const componentsDirectory = path.dirname(path.dirname(folderPath));
    const componentTypePath   = path.join(componentsDirectory, componentType.value);

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

    const componentPath = path.join(componentTypePath, singleComponent.value, singleComponent.value + '.js');

    const propList = fileUtil.getProps(componentPath);

    let requiredProps = [];
    if (propList) {
        requiredProps = await prompts.pickMany(propList, 'Select Required Props', 'Select the props that are required for the item to render');
    }

    const folderName   = syntax.getName(file);
    const singularName = format.toSingular(folderName);
    const words        = singularName.split("-");
    let   elementName  = words.pop();
          elementName  = format.toSingular(elementName);

    elementName = await prompts.input('Enter a name for the element', `e.g, component__ELEMENT-NAME`);

    return {
        type: componentType.value,
        tag: singleComponent.value,
        requiredProps,
        elementName
    };
}

const fileContent = function (file, component) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName     = syntax.getDirName(file);
  const dirLetter   = format.toFirstLetter(dirName);

  const requiredPropsList = component.requiredProps.join(', ');
  const requiredPropsNotProvided = '!' + component.requiredProps.join(' || !');
  const setRequiredProps = component.requiredProps.map(prop => `${prop}={${prop}}`);

  const className = `${dirLetter}-${folderKebab}`;

  return `import classNames from '@utils/classNames';
import ${component.tag} from '@${component.type}/${component.tag}';

const ${folderClass} = ({
  className,
  items,
  ...rest
}) => {
  if (!items || !items.length) return;
  
  const classBase = '${className}';
  const classes   = classNames(className, classBase);

  return (
    <div className={classes} {...rest}>
      <ul className={\`\${classBase}__list\`}>
        {items.map(({ ${requiredPropsList}, ...item }, index) => {
          if (${requiredPropsNotProvided}) return null;

          return (
            <li key={index} className={\`\${classBase}__item\`}>
              <${component.tag}
                className={\`\${classBase}__${component.elementName}\`}
                {...item}
                ${setRequiredProps.join('\n                ')}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ${folderClass};
`
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}
