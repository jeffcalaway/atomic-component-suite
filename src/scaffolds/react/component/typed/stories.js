const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.stories.ts`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName     = syntax.getDirName(file);
  const dirTitle    = format.toCapsAndSpaces(dirName);

  const propConst = folderClass.charAt(0).toLowerCase() + folderClass.slice(1) + 'Props';

  return `import React from 'react'
import ${folderClass}, { ${propConst} } from './${folderClass}';

export default {
  title: '${dirTitle}/${folderTitle}',
  component: ${folderClass},
  tags: ['autodocs'],
  args: {
    
  }
}

const Template = (args: ${propConst}) => <${folderClass} {...args} />

export const Default = Template.bind({})
`
}

module.exports = {
    filePath,
    fileContent
}