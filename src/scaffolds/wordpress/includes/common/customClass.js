const format  = require('../../../../utils/format');
const syntax  = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');

const filePath = function (file, title) {
  const fileName = format.toKebab(title);
  const targetPath = file.fsPath;
  return `${targetPath}/class-${fileName}.php`;
}

const filePrompt = async function () {
  return await prompts.input('Enter the title of the class');
}

const fileContent = function (file, title) {
  const folderName = syntax.getName(file);

  const parentClassName = format.toCapsAndSnake(folderName);
  const className       = format.toCapsAndSnake(title);
  const classTitle      = format.toCapsAndSpaces(title);

  return `<?php
/**
 * ${classTitle}
 *
 * @package Theme/${parentClassName}
 * @version 1.0.0
 */

namespace Useful_Group\\Includes\\${parentClassName};
      use Useful_Framework\\Library;

class ${className} extends Library\\Package {

    public function initialize() {
        parent::initialize();
    }

    

}`;
}

module.exports = {
  filePath,
  filePrompt,
  fileContent
}