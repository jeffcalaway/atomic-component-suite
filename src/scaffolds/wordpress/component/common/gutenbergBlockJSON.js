const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.block.json`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const dirName     = syntax.getDirName(file);

  return `{
    "name": "${dirName}/${folderName}",
    "title": "${folderTitle}",
    "description": "${folderTitle} module.",
    "category": "${dirName}",
    "apiVersion": 3,
    "acf": {
        "mode": "preview",
        "renderTemplate": "template-parts/${dirName}/${folderName}/${folderName}.block.php",
        "blockVersion": 3
    },
    "supports": {
        "anchor": true
    }
}`;
}

module.exports = {
    filePath,
    fileContent
}