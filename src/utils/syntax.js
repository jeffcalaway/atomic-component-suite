const path = require('path');

const getPath = function (file) {
  return file.fsPath
}

const getName = function (file) {
  return path.basename(getPath(file));
}

const getDirName = function (file) {
  return path.basename(path.dirname(getPath(file)));
}

const getFile = function ( file, ext ) {
  const folderPath = getPath(file);
  const folderName = getName(file);

  return `${folderPath}/${folderName}${ext}`;
}

module.exports = {
  getPath,
  getName,
  getDirName,
  getFile
}