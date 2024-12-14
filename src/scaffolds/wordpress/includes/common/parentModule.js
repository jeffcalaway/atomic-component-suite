const format  = require('../../../../../utils/format');
const syntax  = require('../../../../../utils/syntax');
const prompts = require('../../../../../utils/prompts');

const filePath = function (file) {
    const pluralName = syntax.getName(file);
    const dirPath = syntax.getDirPath(file);
    return `${dirPath}/class-${pluralName}.php`;
}

const filePrompt = function () {
  const options = [
    {
      label: 'Setup',
      value: 'setup'
    },
    {
      label: 'Template Blocks',
      value: 'template_blocks'
    },
    {
      label: 'Template Data',
      value: 'template_data'
    },
    {
      label: 'Hooks',
      value: 'hooks'
    },
  ];

  const selected = prompts.pickMany(
    options,
    'Generate Parent Module',
    'Select which modules you would like to include',
  );

  if (!selected) return;

  // get only the value of the selected options
  const selectedValues = selected.map(option => option.value);

  return selectedValues;
}

const fileContent = function (file, modules = []) {
  const folderName = syntax.getName(file);

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
  filePath,
  filePrompt,
  fileContent
}