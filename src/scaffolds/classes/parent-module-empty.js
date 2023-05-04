const format      = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  return `<?php

  namespace Useful_Group\\Includes;
        use Useful_Framework\\Library;
  
  class ${pluralClass} extends Library\\Master {
  
      public function initialize() {
          parent::initialize();
      }
  
  
      public function __construct() {
          parent::__construct();
  
          // $this->setup = new ${pluralClass}\\Setup();
  
          $this->add_modules([
              // $this->setup
          ]);
      }
  }`;
}

module.exports = {
  template
}