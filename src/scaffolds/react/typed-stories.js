const format = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName = getDirName(file);
  const dirTitle = format.toCapsAndSpaces(dirName);

  return `import type { Meta, StoryObj } from '@storybook/react';

import ${folderClass} from './${folderClass}';

const meta: Meta<typeof ${folderClass}> = {
  title: '${dirTitle}/${folderTitle}',
  component: ${folderClass},
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ${folderClass}>;

export const Default: Story = {
  args: {
    
  },
};`
}

module.exports = {
  template
}