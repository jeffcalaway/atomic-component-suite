const format = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName = getDirName(file);
  const dirTitle = format.toCapsAndSpaces(dirName);

  return `import React from 'react'
import ${folderClass} from './${folderClass}';

export default {
  title: '${dirTitle}/${folderTitle}',
  args: {
    
  }
}

const Template = args => <${folderClass} {...args} />

export const Default = Template.bind({})
`
}

module.exports = {
  template
}