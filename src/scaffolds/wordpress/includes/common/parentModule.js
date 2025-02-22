const format   = require('../../../../utils/format');
const syntax   = require('../../../../utils/syntax');
const prompts  = require('../../../../utils/prompts');
const fileUtil = require('../../../../utils/file');
const theme    = require('../../../../utils/theme');

const filePath = function (file) {
    const pluralName = syntax.getName(file);
    const dirPath = syntax.getDirPath(file);
    return `${dirPath}/class-${pluralName}.php`;
}

const filePrompt = async function (file, passedValue = false) {
  let promptValue = passedValue;

  if (!passedValue) {
    const folderName   = syntax.getName(file);
    const singularName = format.toSingular(folderName);
    const interfaceFile = `class-${singularName}.php`;

    // get array of file names in the directory
    const files = fileUtil.getFiles(file);
    const acceptableFiles = files.filter(dirFile => {
      if (dirFile == 'functions.php') return false;
      if (dirFile == interfaceFile) return false;
      return true;
    });

    const options = acceptableFiles.map(file => {
      const fileName = format.removeClassAndPhp(file);
      const label = format.toCapsAndSpaces(fileName);
      const value = format.toLowAndSnake(fileName);
      return {
        label,
        value
      };
    });

    let selected = [];
    if (options.length) {
      selected = await prompts.pickMany(
        options,
        'Generate Parent Module',
        'Select which modules you would like to include',
      );
    }

    // get only the value of the selected options
    promptValue = selected.map(option => option.value);
  }

  const filePath = syntax.getPath(file);
  const fileName = syntax.getName(filePath);
  const fileTitle = format.removeClassAndPhp(fileName);

  const addToThemeFunctions = await prompts.confirm(`Would you like to initialize the "${fileTitle} Parent Module" in the Theme Functions file?`, {modal: true});
          
  if (addToThemeFunctions == 'Yes') {
      theme.addToThemeFunctions(`${filePath}.php`);
  }

  return promptValue;
}

const fileContent = function (file, modules = []) {
  const folderName = syntax.getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  const projectNamespace = fileUtil.getProjectNamespace(file);

  // Generate properties lines
  const properties = modules.map(module => {
    const lowerSnake = format.toLowAndSnake(module);
    return `    public $${lowerSnake};`;
  }).join('\n');

  // Generate assignments in the constructor
  const longestAssignmentNameLength = modules.length
    ? Math.max(...modules.map(module => format.toLowAndSnake(module).length))
    : 2;

  const assignments = modules.map(module => {
      const capSnake   = format.toCapsAndSnake(module);
      const lowerSnake = format.toLowAndSnake(module);
      
      // Pad the lowerSnake variable name to ensure alignment
      const lowerSnakePadded = lowerSnake.padEnd(longestAssignmentNameLength);
      
      return `        $this->${lowerSnakePadded} = new ${pluralClass}\\${capSnake}();`;
  }).join('\n');

  // Generate modules array
  let moduleList;
  if (modules) {
    moduleList = modules.map(module => {
      const lowerSnake = format.toLowAndSnake(module);
      return `\n            $this->${lowerSnake}`;
    }).join(',');
  }

  if (!moduleList) {
    moduleList = '\n            ';
  }

  return `<?php

namespace ${projectNamespace}\\Includes;
      use Useful_Framework\\Library;

class ${pluralClass} extends Library\\Master {
${properties ? '\n' + properties + '\n' : ''}
    public function initialize() {
        parent::initialize();
    }

    public function __construct() {
        parent::__construct();
${assignments ? '\n' + assignments + '\n' : ''}
        $this->add_modules([${moduleList}
        ]);
    }
}`;
}

module.exports = {
  filePath,
  filePrompt,
  fileContent
}