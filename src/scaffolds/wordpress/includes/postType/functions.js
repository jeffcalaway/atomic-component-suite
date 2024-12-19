const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');

const filePath = function (file) {
    const targetPath = file.fsPath;
    return `${targetPath}/functions.php`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);

  const pluralName  = format.toPlural(folderName);
  const pluralSnake = format.toLowAndSnake(pluralName);
  const pluralRef   = format.toLowAndSpaces(pluralName);
  const pluralTitle = format.toCapsAndSpaces(pluralName);
  const className = format.toCapsAndSnake(folderName);

  const singleName  = format.toSingular(folderName);
  const singleSnake = format.toLowAndSnake(singleName);
  const singleRef   = format.toLowAndSpaces(singleName);
  const singleTitle = format.toCapsAndSpaces(singleName);
  const singleClass = format.toCapsAndSnake(singleName);

  return `<?php
/**
 * ${singleTitle} Functions
 * 
 * Functions specific to ${singleRef} handling.
 *
 * @package Theme/${className}
 * @version 1.0.0
 */

use Useful_Group\\Includes\\${className}\\${singleClass};

//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${pluralTitle} Page Link
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve the link to the ${pluralRef} archive page.
 * 
 * @return string
 */
function get_${pluralSnake}_link() {
    $option = get_option('page_for_${pluralSnake}');
    return $option ? get_permalink($option) : '';
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Check If Is ${singleTitle}
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Check if post is a ${singleRef}.
 * 
 * @param int|WP_Post|null $post
 *  Post id or post object
 * 
 * @return boolean
 */
function is_${singleSnake}($post=false) {
    if ( !$post ) $post = get_the_ID();
    return ${singleClass}::is_${singleSnake}($post);
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle}
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} given a post ID or post/${singleSnake} object.
 *
 * @param int|WP_Post|${singleClass}|null $${singleSnake}
 *  Post ID, post object, ${singleSnake} object
 * 
 * @return ${singleClass}|null
 */
function get_${singleSnake}( $${singleSnake} = null ) {
    if ( empty( $${singleSnake} ) && isset( $GLOBALS['${singleName}'] ) ) {
        $${singleSnake} = $GLOBALS['${singleName}'];
    }

    if ( !$${singleSnake} ) return null;

    if ( $${singleSnake} instanceof ${singleClass} ) {
        $_${singleSnake} = $${singleSnake};
    } else {
        $_${singleSnake} = ${singleClass}::get_instance($${singleSnake});
    }

    if ( !$_${singleSnake} ) return null;

    return $_${singleSnake};
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${pluralTitle}
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve list of ${pluralRef}.
 *
 * @param array $args
 *  Arguments for get_posts()
 * 
 * @return array
 */
function get_${pluralSnake}( $args = null ) {
    if ( !$args ) $args = [
        'numberposts' => -1,
        'orderby'     => 'menu_order date'
    ];

    $args['post_type'] = '${singleName}';

    return get_posts($args);
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Setup ${singleTitle} Data
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Setup global ${singleRef} data.
 * 
 * @global ${singleClass} $${singleSnake}
 *
 * @param int|WP_Post|${singleClass}|null $${singleSnake}
 *  Post ID, post object, ${singleSnake} object
 * 
 * @return boolean
 */
function setup_${singleSnake}data( $${singleSnake} ) {
    $_${singleSnake} = get_${singleSnake}($${singleSnake});

    if ( !$_${singleSnake} ) return false;

    unset( $GLOBALS['${singleName}'] );

    $GLOBALS['${singleName}'] = $_${singleSnake};

    do_action('setup_${singleSnake}data', $GLOBALS['${singleName}']);

    return true;
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Reset ${singleTitle} Data
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Restore global ${singleRef} data to current queried object.
 * 
 * @global ${singleClass} $${singleSnake}
 */
function reset_${singleSnake}data() {
    $post = get_queried_object();

    if (
        empty( $post->post_type )
        || $post->post_type != '${singleName}'
    ) return;

    setup_${singleSnake}data($post);
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} ID
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} id given a post ID or post object.
 *
 * @param int|WP_Post|${singleClass}|null $${singleSnake}
 *  Post ID, post object, ${singleSnake} object
 * 
 * @return int|null
 */
function get_${singleSnake}_id( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_id();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} Title
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} title given a post ID or post object.
 *
 * @param int|WP_Post|${singleClass}|null $${singleSnake}
 *  Post ID, post object, ${singleSnake} object
 * 
 * @return string|null
 */
function get_${singleSnake}_title( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_title();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} Thumbnail
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} thumbnail given a post ID or post object.
 *
 * @param int|WP_Post|${singleClass}|null $${singleSnake}
 *  Post ID, post object, ${singleSnake} object
 * 
 * @return string|null
 */
function get_${singleSnake}_thumbnail( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_thumbnail();
}`;
}

module.exports = {
    filePath,
    fileContent
}