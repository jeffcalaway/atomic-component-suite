const format                  = require('../utils/format');
const { getName, getDirName } = require('../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

  return `.${className} {
    
}`;
}

module.exports = {
  template
}