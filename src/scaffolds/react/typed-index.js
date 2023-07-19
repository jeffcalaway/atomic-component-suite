const format = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderClass = format.toCapsAndSnake(folderName);

  return `export { default } from './${folderClass}'
export type { ${folderClass}Props } from './${folderClass}'`
}

module.exports = {
  template
}