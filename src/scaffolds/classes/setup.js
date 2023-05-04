const format      = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);

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
  template
}