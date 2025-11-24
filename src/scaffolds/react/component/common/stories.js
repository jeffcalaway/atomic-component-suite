const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.stories.jsx`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName     = syntax.getDirName(file);
  const dirTitle    = format.toCapsAndSpaces(dirName);

  return `import React from 'react'
import ${folderClass} from './${folderClass}';

export default {
  title: '${dirTitle}/${folderTitle}',
  args: {
    
  }
}

const Template = (args) => <${folderClass} {...args} />

export const Default = Template.bind({});`
}

module.exports = {
    filePath,
    fileContent
}