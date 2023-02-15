const format      = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  return `<?php
/**
 * Template Blocks
 *
 * A class that handles template blocks.
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */

namespace Useful_Group\\Includes\\${pluralClass};
      use Useful_Framework\\Library;

class Template_Blocks extends Library\\Package {

    public function initialize() {

        parent::initialize();
    }
}`;
}

module.exports = {
  template
}