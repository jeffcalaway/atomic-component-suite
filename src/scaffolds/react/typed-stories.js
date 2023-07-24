const format = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName = getDirName(file);
  const dirTitle = format.toCapsAndSpaces(dirName);

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
  template
}