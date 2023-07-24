const format = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const propConst = folderClass.charAt(0).toLowerCase() + folderClass.slice(1) + 'Props';

  return `export { default } from './${folderClass}'
export type { ${propConst} } from './${folderClass}'`
}

module.exports = {
  template
}