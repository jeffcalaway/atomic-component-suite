const format = require('../../../../utils/format');
const fileUtil = require('../../../../utils/file');
const syntax = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');

const filePath = function (file) {
  const targetPath = file.fsPath;
  return `${targetPath}/class-setup.php`;
}

const filePrompt = async function (file, passedValue = false) {
    let icon = passedValue;
    
    if (!passedValue) {
        const iconType = await prompts.pickOne(
            ['Dashicons', 'Custom Asset'],
            'Icon Type',
            'Select the icon type for the post type.'
        );
    
        if (!iconType) return;

        if (iconType === 'Dashicons') {
            icon = await prompts.selectDashicon('Select Dashicon', 'Select the dashicon for the post type.');
            icon = icon ? `'${icon}'` : null;
        } else if (iconType === 'Custom Asset') {
            const folderPath = file.fsPath;
            const includesFolder = fileUtil.getDirectory(folderPath);
            const themeFolder = fileUtil.getDirectory(includesFolder);
            const imagesFolder = `${themeFolder}/assets/images`;
            
            // check if the images folder exists
            if (!fileUtil.exists(imagesFolder)) {
                prompts.errorMessage('Could not find the images folder.');
                return;
            }

            const iconsFolder = `${imagesFolder}/icons`;
            const assetsPath  = fileUtil.exists(iconsFolder) ? iconsFolder : imagesFolder;
            const getAssetPath = fileUtil.exists(iconsFolder) ? 'images/icons' : 'images';

            icon = await prompts.selectAsset(
                assetsPath,
                getAssetPath,
                'Select Image Asset',
                'Select the icon for the post type.'
            );
        }
    }

    return (icon && icon !== undefined) ? icon : `'${'dashicons-embed-post'}'`;
}

const fileContent = function (file, icon) {
  const folderName = syntax.getName(file);

  const pluralName  = format.toPlural(folderName);
  const pluralTitle = format.toCapsAndSpaces(pluralName);
  const className   = format.toCapsAndSnake(folderName);

  const singleName  = format.toSingular(folderName);
  const singleTitle = format.toCapsAndSpaces(singleName);

  const projectNamespace = fileUtil.getProjectNamespace(file);

  return `<?php
/**
 * ${pluralTitle} Setup
 *
 * A class that registers and manages the
 * ${pluralTitle} post type.
 *
 * @package Theme/${className}
 * @version 1.0.0
 */

namespace ${projectNamespace}\\Includes\\${className};
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
            'add_new'            => 'Add New ${singleTitle}',
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
            'menu_icon'           => ${icon},
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
  filePath,
  filePrompt,
  fileContent
}