const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
  const targetPath = file.fsPath;
  return `${targetPath}/class-setup.php`;
}

const fileContent = function (file, postTypeName) {
  const folderName = syntax.getName(file);

  const pluralName  = folderName;
  const pluralTitle = format.toCapsAndSpaces(pluralName);
  const pluralClass = format.toCapsAndSnake(pluralName);

  const singleName  = format.toSingular(folderName);
  const singleTitle = format.toCapsAndSpaces(singleName);

  // Post Type Name Formats
  const pluralPtName  = format.toPlural(postTypeName).toLowerCase();
  const pluralPtSlug  = format.toKebab(pluralPtName);
  const pluralPtSnake = format.toLowAndSnake(pluralPtName);

  return `<?php
/**
 * ${pluralTitle} Setup
 *
 * A class that registers and manages the
 * ${pluralTitle} taxonomy.
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */
  
namespace Useful_Group\\Includes\\${pluralClass};
      use Useful_Framework\\Library;
  
class Setup extends Library\\Package {
  
    public function initialize() {
        $this->add_action( 'init', 'register_taxonomy', 5 );
        $this->add_filter( 'theme/${pluralPtSlug}/register/taxonomies', 'add_taxonomy_to_${pluralPtSnake}', 10 );

        parent::initialize();
    }
  
  
    public function register_taxonomy() {
        $post_types = apply_filters('theme/${pluralName}/register/post_types', []);

        $labels = [
            'name'              => _x( '${pluralTitle}', 'taxonomy general name' ),
            'singular_name'     => _x( '${singleTitle}', 'taxonomy singular name' ),
            'search_items'      => __( 'Search ${pluralTitle}' ),
            'all_items'         => __( 'All ${pluralTitle}' ),
            'parent_item'       => __( 'Parent ${singleTitle}' ),
            'parent_item_colon' => __( 'Parent ${singleTitle}:' ),
            'edit_item'         => __( 'Edit ${singleTitle}' ),
            'update_item'       => __( 'Update ${singleTitle}' ),
            'add_new_item'      => __( 'Add New ${singleTitle}' ),
            'new_item_name'     => __( 'New ${singleTitle} Name' ),
            'menu_name'         => __( '${pluralTitle}' )
        ];

        $rewrite = [
            'slug'         => '${singleName}',
            'hierarchical' => true,
            'with_front'   => false
        ];

        $args = [
            'hierarchical'      => true,
            'labels'            => $labels,
            'public'            => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => 'custom_page',
            'rewrite'           => $rewrite
        ];

        register_taxonomy( '${singleName}', $post_types, $args );
    }
    
    
    public function add_taxonomy_to_${pluralPtSlug}($taxonomies) {
        array_push( $taxonomies, '${singleName}' );
        return $taxonomies;
    }
}`;
}

module.exports = {
  filePath,
  fileContent
}