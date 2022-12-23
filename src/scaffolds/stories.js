const format                  = require('../utils/format');
const { getName, getDirName } = require('../utils/syntax');

const template = function (file) {
  const folderName  = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName     = getDirName(file);
  const dirTitle    = format.toCapsAndSpaces(dirName);

  return `<?php
  
use Useful_Stories\\Library\\Stories;
  
class ${folderClass} extends Stories {
    function __construct(){
        $this->title    = '${dirTitle}/${folderTitle}';
        $this->defaults = [
            
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
  template
}