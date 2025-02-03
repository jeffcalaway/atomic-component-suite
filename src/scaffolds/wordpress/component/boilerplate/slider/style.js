const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.scss`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);
  const dirName    = syntax.getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;
  const include = dirLetter == 'o' ? '@include theme-margins;' : '';

  return `.${className} {
    ${include}
}`;
}

module.exports = {
  filePath,
  fileContent
}