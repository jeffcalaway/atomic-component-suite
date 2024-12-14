const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const targetPath = file.fsPath;
    return `${targetPath}/index.js`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);

  return `export { default } from './${folderClass}'`
}

module.exports = {
    filePath,
    fileContent
}