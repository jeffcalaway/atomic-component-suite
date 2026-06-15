const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');
const fileUtil = require('../../../../utils/file');
const path = require('path');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.contentful.js`;
}

const filePrompt = async function (file, passedValue = false) {
    if (passedValue) return passedValue;

    const folderName = syntax.getName(file);
    const componentPath = path.join(file.fsPath, `${folderName}.js`);
    const excludedProps = ['id', 'className', 'children', 'ref', 'key'];
    const defaultContext = {
      propsToMap: []
    };

    if (!fileUtil.exists(componentPath)) {
      return defaultContext;
    }

    const componentProps = fileUtil.getProps(componentPath) || [];
    const pickableProps = componentProps.filter((prop) => !excludedProps.includes(prop));

    if (!pickableProps.length) {
      return defaultContext;
    }

    const storybookOption = 'Storybook™ Props'
    const selectedProps = await prompts.pickMany(
      [
        ...pickableProps,
        storybookOption
      ],
      'Select Props to Map',
      'Select the component props to map from entry.fields'
    );

    const includeStoryArgs = selectedProps.includes(storybookOption);
    const selectedPropsWithoutStory = selectedProps.filter((prop) => prop !== storybookOption);

    return {
      propsToMap: selectedPropsWithoutStory || defaultContext.propsToMap,
      includeStoryArgs
    };
}

const fileContent = function (file, context = {}) {
  const folderName = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const directoryName = syntax.getDirName(file).toLowerCase();
  const componentName = format.toCapsAndCamel(folderName);
  const contentType = `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}`;

  const selectedProps = (context && Array.isArray(context.propsToMap)) ? context.propsToMap : [];
  const mappedPropLines = selectedProps.map((prop) => {
    const isButton = prop.includes('button') || prop.includes('Button');
    const isImage = prop.includes('image') || prop.includes('Image');
    
    if (isButton) {
      return `    ${prop}: await getButtonField('${prop}', entry)`;
    }
    
    if (isImage) {
      return `    ${prop}: await getImageField('${prop}', entry)`;
    }

    return `    ${prop}: await getField('${prop}', entry)`;
  });

  const includeStoryArgs = context && context.includeStoryArgs;

  const helperImports = [
    'getEntryId',
    'getField'
  ];

  if (selectedProps.some((prop) => prop.includes('image') || prop.includes('Image'))) {
    helperImports.push('getImageField');
  }

  if (selectedProps.some((prop) => prop.includes('button') || prop.includes('Button'))) {
    helperImports.push('getButtonField');
  }

  const importEntries = [
    `import { ${helperImports.join(', ')} } from '@lib/contentful/helpers';`
  ];
  const returnEntries = [
    '    type: contentType',
    '    id: getEntryId(entry)',
    ...mappedPropLines
  ];

  if (includeStoryArgs) {
    importEntries.push(`import ${folderClass}Stories from '@${directoryName}/${folderClass}/${folderClass}.stories';`);
    returnEntries.push(`    ...${folderClass}Stories.args`);
  }

  const importLines = importEntries.join('\n');
  const returnLines = returnEntries.join(',\n');

  return `${importLines}

export const contentType = '${contentType}';

export default async function map${componentName}(entry) {
  return {
${returnLines}
  };
}`
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}