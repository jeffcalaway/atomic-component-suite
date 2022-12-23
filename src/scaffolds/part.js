const format                  = require('../utils/format');
const { getName, getDirName } = require('../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

  return `<?php
    $props->admit_props([
        'KEY_NAME'
    ]);

    extract($props->to_array());

    $class = $props->class([
        '${className}'
    ]);
?>`;
}

module.exports = {
  template
}