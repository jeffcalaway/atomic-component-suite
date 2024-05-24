const format      = require('../../utils/format');
const { getName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);

  const pluralName  = folderName;
  const pluralTitle = format.toCapsAndSpaces(pluralName);
  const pluralClass = format.toCapsAndSnake(pluralName);

  const singleName  = format.toSingular(folderName);
  const singleTitle = format.toCapsAndSpaces(singleName);

  return `<?php
/**
 * ${pluralTitle} Setup
 *
 * A class that registers and manages the
 * ${pluralTitle} post type.
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */

namespace Useful_Group\\Includes\\${pluralClass};
      use Useful_Framework\\Library;

class Setup extends Library\\Package {

    public function initialize() {
        $this->add_action( 'init', 'register_post_type' );

        parent::initialize();
    }


    public function register_post_type() {
        $labels = [
            'name'               => '${pluralTitle}',
            'singular_name'      => '${singleTitle}',
            'add_new_item'       => 'Add ${singleTitle}',
            'edit_item'          => 'Edit ${singleTitle}',
            'new_item'           => 'New ${singleTitle}',
            'view_item'          => 'View ${singleTitle}',
            'search_items'       => 'Search ${pluralTitle}',
            'not_found'          => 'No ${pluralTitle} Found',
            'not_found_in_trash' => 'No ${pluralTitle} Found in Trash',
            'parent_item_colon'  => 'Parent ${singleTitle}'
        ];

        $supports = apply_filters('theme/${pluralName}/register/supports', [
            'title',
            'page-attributes',
            'thumbnail'
        ]);

        $taxonomies = apply_filters('theme/${pluralName}/register/taxonomies', []);

        $rewrite = [
            'slug'       => '${singleName}',
            'with_front' => true,
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'exclude_from_search' => false,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_nav_menus'   => true,
            'show_in_menu'        => true,
            'show_in_admin_bar'   => true,
            'menu_position'       => null,
            'menu_icon'           => 'dashicons-embed-post',
            'capability_type'     => 'post',
            'hierarchical'        => true,
            'supports'            => $supports,
            'taxonomies'          => $taxonomies,
            'has_archive'         => 'custom_page',
            'rewrite'             => $rewrite,
            'query_var'           => true,
            'show_in_rest'        => true
        ];

        register_post_type( '${singleName}', $args );
    }
}`;
}

module.exports = {
  template
}