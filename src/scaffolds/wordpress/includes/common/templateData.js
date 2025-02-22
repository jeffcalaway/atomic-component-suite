const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const fileUtil = require('../../../../utils/file');

const filePath = function (file) {
  const targetPath = file.fsPath;
  return `${targetPath}/class-template-data.php`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  const projectNamespace = fileUtil.getProjectNamespace(file);

  return `<?php
/**
 * Template Data
 *
 * A class that handles template data.
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */

namespace ${projectNamespace}\\Includes\\${pluralClass};
      use Useful_Framework\\Library;

class Template_Data extends Library\\Package {

    public function initialize() {

        parent::initialize();
    }
}`;
}

module.exports = {
  filePath,
  fileContent
}