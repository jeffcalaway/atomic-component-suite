const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const fileUtil = require('../../../../utils/file');

const filePath = function (file) {
    const targetPath = file.fsPath;
    return `${targetPath}/functions.php`;
}

const fileContent = function (file, postTypeName) {
  const folderName = syntax.getName(file);
  
  const pluralName  = folderName;
  const pluralSnake = format.toLowAndSnake(pluralName);
  const pluralRef   = format.toLowAndSpaces(pluralName);
  const pluralTitle = format.toCapsAndSpaces(pluralName);
  const pluralClass = format.toCapsAndSnake(pluralName);
  
  const singleName  = format.toSingular(folderName);
  const singleSnake = format.toLowAndSnake(singleName);
  const singleRef   = format.toLowAndSpaces(singleName);
  const singleTitle = format.toCapsAndSpaces(singleName);
  const singleClass = format.toCapsAndSnake(singleName);
  
  // Post Type Name Formats
  const pluralPtName     = format.toPlural(postTypeName);
  const pluralPtCapName  = format.toCapsAndSpaces(pluralPtName);
  const pluralPtLowName  = format.toLowAndSpaces(pluralPtName);
  const pluralPtLowSnake = format.toLowAndSnake(pluralPtName);

  const projectNamespace = fileUtil.getProjectNamespace(file);

  return `<?php
/**
 * ${singleTitle} Functions
 * 
 * Functions specific to ${singleRef} handling.
 *
 * @package Theme/${pluralClass}
 * @version 1.0.0
 */

use ${projectNamespace}\\Includes\\${pluralClass}\\${singleClass};

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
 * Check if term is a ${singleRef}.
 * 
 * @param int|WP_Term|null $term
 *  Term id or term object
 * 
 * @return boolean
 */
function is_${singleSnake}( $term = false ) {
    if ( !$term ) $term = get_queried_object();
    return ${singleClass}::is_${singleSnake}($term);
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle}
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} given a term ID or term/${singleClass} object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return ${singleClass}|null
 */
function get_${singleSnake}( $${singleSnake} = null ) {
    if ( empty( $${singleSnake} ) && isset( $GLOBALS['${singleName}'] )) {
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
 *  Arguments for get_terms()
 * 
 * @return array
 */
function get_${pluralSnake}( $args = [] ) {
    $args = array_merge([
        'hide_empty' => false,
        'orderby'    => 'name'
    ], $args);

    $args['taxonomy'] = '${singleName}';

    return get_terms($args);
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} Term
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} term given a term ID or term object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return WP_Term|null
 */
function get_${singleSnake}_term( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_term();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} ID
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} id given a term ID or term object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return string|null
 */
function get_${singleSnake}_id( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_id();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} Slug
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} slug given a term ID or term object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return string|null
 */
function get_${singleSnake}_slug( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_slug();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} Url
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} url given a term ID or term object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return string
 */
function get_${singleSnake}_url( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_url();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} Title
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} title given a term ID or term object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return string|null
 */
function get_${singleSnake}_title( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_title();
}


//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ✅ Get ${singleTitle} ${pluralPtCapName}
//≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
/**
 * Retrieve ${singleRef} ${pluralPtLowName} given a term ID or term object.
 *
 * @param int|WP_Term|${singleClass}|null $${singleSnake}
 *  Term ID, term object, ${singleClass} object
 * 
 * @return string|null
 */
function get_${singleSnake}_${pluralPtLowSnake}( $${singleSnake} = null ) {
    $${singleSnake} = get_${singleSnake}($${singleSnake});

    if (!$${singleSnake}) return;

    return $${singleSnake}->get_${pluralPtLowSnake}();
}`;
}

module.exports = {
    filePath,
    fileContent
}