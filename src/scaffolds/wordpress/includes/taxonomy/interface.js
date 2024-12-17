const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');

const filePath = function (file) {
    const folderName   = syntax.getName(file);
    const singularName = format.toSingular(folderName)
    const targetPath   = file.fsPath;
    return `${targetPath}/class-${singularName}.php`;
}

const fileContent = function (file, postTypeName) {
  const folderName = syntax.getName(file);

  const pluralName  = folderName;
  const pluralClass = format.toCapsAndSnake(pluralName);

  const singleName  = format.toSingular(folderName);
  const singleSnake = format.toLowAndSnake(singleName);
  const singleTitle = format.toCapsAndSpaces(singleName);
  const singleClass = format.toCapsAndSnake(singleName);

  // Post Type Name Formats
  const singularPtName = format.toSingular(postTypeName);
  const singularPtSlug = format.toKebab(singularPtName);
  const pluralPtName   = format.toPlural(postTypeName);
  const pluralPtSnake  = format.toLowAndSnake(pluralPtName);

  return `<?php
    /**
     * ${singleTitle}
     *
     * @package Theme/${pluralClass}
     * @version 1.0.0
     */
    
    namespace Useful_Group\\Includes\\${pluralClass};
    
    class ${singleClass} {
    
        public static function is_${singleSnake}($term) {
            $term = get_term( $term, '${singleName}' );
  
            if ( !$term || $term->taxonomy !== '${singleName}' ) return false;
  
            return true;
        }
    
    
        public static function get_instance($term) {
            $term = get_term( $term, '${singleName}' );
    
            if ( !self::is_${singleSnake}($term) ) return false;
    
            return new self($term);
        }
    
    
        public function __construct($term) {
            $this->term = get_term( $term, '${singleName}' );
        }
    
    
        public function get_taxonomy() {
            return '${singleName}';
        }
  
  
        public function get_term() {
          return $this->term;
      }
    
    
        public function get_id() {
            return $this->term->term_id;
        }
    
    
        public function get_slug() {
            return $this->term->slug;
        }
  
  
        public function get_url() {
            return get_term_link( $this->term, $this->get_taxonomy() );
        }
  
  
        public function get_title() {
            return $this->term->name;
        }
  
  
        public function get_${pluralPtSnake}( $args = null ) {
            if ( !$args ) {
                $args = [
                    'numberposts' => -1,
                    'orderby'     => 'menu_order date'
                ];
            }
  
            $args['${singleName}'] = $this->term->slug;
            $args['post_type']     = '${singularPtSlug}';
  
            return get_posts($args);
      }
  }`;
}

module.exports = {
  filePath,
  fileContent
}