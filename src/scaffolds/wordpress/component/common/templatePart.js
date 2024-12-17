const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.php`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);
  const dirName    = syntax.getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

  return `<?php
    $props->admit_props([
        
    ]);

    extract($props->to_array());

    $class = $props->class([
        '${className}'
    ]);
?>`;
}

module.exports = {
    filePath,
    fileContent
  }