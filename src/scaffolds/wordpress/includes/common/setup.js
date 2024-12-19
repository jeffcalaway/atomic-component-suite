const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');

const filePath = function (file) {
  const targetPath = file.fsPath;
  return `${targetPath}/class-setup.php`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);

  const pluralName  = folderName;
  const pluralTitle = format.toCapsAndSpaces(pluralName);
  const pluralClass = format.toCapsAndSnake(pluralName);

  return `<?php
/**
 * ${pluralTitle} Setup
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */

namespace Useful_Group\\Includes\\${pluralClass};
      use Useful_Framework\\Library;

class Setup extends Library\\Package {

    public function initialize() {
        parent::initialize();
    }

    
}`;
}

module.exports = {
  filePath,
  fileContent
}