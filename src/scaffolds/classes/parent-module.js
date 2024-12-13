const format      = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file, modules = []) {
  const folderName = getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  // Generate properties lines
  const properties = modules.map(module => {
    const lowerSnake = format.toLowAndSnake(module);
    return `      public $${lowerSnake};`;
  }).join('\n');

  // Generate assignments in the constructor
  const assignments = modules.map(module => {
    const capSnake = format.toCapsAndSnake(module);
    const lowerSnake = format.toLowAndSnake(module);
    return `          $this->${lowerSnake} = new ${pluralClass}\\${capSnake}();`;
  }).join('\n');

  // Generate modules array
  const moduleList = modules.map(module => {
    const lowerSnake = format.toLowAndSnake(module);
    return `              $this->${lowerSnake},`;
  }).join('\n');

  return `<?php

  namespace Useful_Group\\Includes;
        use Useful_Framework\\Library;
  
  class ${pluralClass} extends Library\\Master {
${properties ? '\n' + properties + '\n' : ''}
      public function initialize() {
          parent::initialize();
      }
  
      public function __construct() {
          parent::__construct();
${assignments ? '\n' + assignments + '\n' : ''}
          $this->add_modules([
${moduleList}
          ]);
      }
  }`;
}

module.exports = {
  template
}