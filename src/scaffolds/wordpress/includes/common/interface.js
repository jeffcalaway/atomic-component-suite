const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const fileUtil = require('../../../../utils/file');

const filePath = function (file) {
    const folderName   = syntax.getName(file);
    const singularName = format.toSingular(folderName)
    const targetPath   = file.fsPath;
    return `${targetPath}/class-${singularName}.php`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  const singleName  = format.toSingular(folderName);
  const singleSnake = format.toLowAndSnake(singleName);
  const singleTitle = format.toCapsAndSpaces(singleName);
  const singleClass = format.toCapsAndSnake(singleName);

  const projectNamespace = fileUtil.getProjectNamespace(file);

  return `<?php
/**
 * ${singleTitle}
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */

namespace ${projectNamespace}\\Includes\\${pluralClass};

class ${singleClass} {

    public static function is_${singleSnake}($post) {
        $post = get_post( $post );

        if ( !$post || get_post_type($post) !== '${singleName}' ) return false;

        return true;
    }


    public static function get_instance($post) {
        $post = get_post( $post, '${singleName}' );

        if ( !self::is_${singleSnake}($post) ) return false;

        return new self($post);
    }


    public function __construct($post) {
        $this->post = get_post( $post, '${singleName}' );
    }


    public function get_() {
        return;
    }
}`;
}

module.exports = {
    filePath,
    fileContent
}