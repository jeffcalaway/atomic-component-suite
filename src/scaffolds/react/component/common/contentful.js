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

    const selectedProps = await prompts.pickMany(
      pickableProps,
      'Select Props to Map',
      'Select the component props to map from entry.fields'
    );

    return {
      propsToMap: selectedProps || defaultContext.propsToMap
    };
}

const fileContent = function (file, context = {}) {
  const folderName = syntax.getName(file);
  const componentName = format.toCapsAndCamel(folderName);
  const contentType = `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}`;

  const selectedProps = (context && Array.isArray(context.propsToMap)) ? context.propsToMap : [];
  const mappedPropLines = selectedProps.map((prop) => `    ${prop}: entry.fields.${prop} || ''`);

  const returnLines = [
    '    type: contentType',
    '    id: getEntryId(entry)',
    ...mappedPropLines
  ].join(',\n');

  return `import { getEntryId } from '@lib/contentful/helpers';

export const contentType = '${contentType}';

export default function map${componentName}(entry) {
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