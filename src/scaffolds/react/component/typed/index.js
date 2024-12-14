const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const targetPath = file.fsPath;
    return `${targetPath}/index.ts`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const propConst   = folderClass.charAt(0).toLowerCase() + folderClass.slice(1) + 'Props';

  return `export { default } from './${folderClass}'
export type { ${propConst} } from './${folderClass}'`
}

module.exports = {
    filePath,
    fileContent
}