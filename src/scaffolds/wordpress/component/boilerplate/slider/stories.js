const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
  const folderName = syntax.getName(file);
  const targetPath = file.fsPath;
  return `${targetPath}/${folderName}.stories.php`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName     = syntax.getDirName(file);
  const dirTitle    = format.toCapsAndSpaces(dirName);

  return `<?php

    use Useful_Stories\\Library\\Stories;

    class ${folderClass} extends Stories {
        function __construct(){
            $this->title    = '${dirTitle}/${folderTitle}';
            $this->defaults = [
              'items' => array_fill(0,3,[
                  
              ])
            ];
        }

        function template($args=[]) {
            $args = wp_parse_args($args, $this->defaults);
    
            render_template_part('${dirName}/${folderName}', $args);
        }

        function initialize() {
            $default = $this->add_story('Default', [$this, 'template']);
        }
    }`;
}

module.exports = {
    filePath,
    fileContent
}