const path = require('path');

const getPath = function (file) {
  return file.fsPath
}

const getName = function (file) {
  return path.basename(getPath(file));
}

const getDirPath = function (file) {
  return path.dirname(getPath(file))
}

const getDirName = function (file) {
  return path.basename(getDirPath(file));
}

const getFile = function ( file, ext, customFolderPath = null ) {
  const folderPath = customFolderPath || getPath(file);
  const folderName = getName(file);

  return `${folderPath}/${folderName}${ext}`;
}

const getThemePath = function (file) {
  let currentDir = getDirPath(file);
  while (currentDir && currentDir !== path.sep) {
    if (getName({ fsPath: currentDir }) === "useful-group") {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

const getBlocksPath = function (file) {
  return `${getThemePath(file)}/template-blocks`;
}

const getBuilderPath = function (file) {
  return `${getBlocksPath(file)}/general/page-builder`;
}

module.exports = {
  getPath,
  getName,
  getDirPath,
  getDirName,
  getFile,
  getThemePath,
  getBlocksPath,
  getBuilderPath
}