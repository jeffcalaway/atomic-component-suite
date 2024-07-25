const format                  = require('../utils/format');
const { getName, getDirName } = require('../utils/syntax');

const phpTemplate = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);

  return `<?php
  $is_gutenberg     = isset($block);
  $id               = $is_gutenberg ? get_isset_val($block, 'anchor'): get_acf_field_value('anchor_tag');
  // $example          = get_acf_field_value( 'example', $is_gutenberg );
?>

<?php render_template_part('${dirName}/${folderName}', [
  'id' => $id,
]); ?>`;
}

const jsonTemplate = function (file) {
  const folderName  = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const dirName     = getDirName(file);

  return `{
    "name": "${dirName}/${folderName}",
    "title": "${folderTitle}",
    "description": "${folderTitle} module.",
    "category": "theme",
    "apiVersion": 2,
    "acf": {
        "mode": "preview",
        "renderTemplate": "template-parts/${dirName}/${folderName}/${folderName}.block.php"
    },
    "supports": {
        "anchor": true
    }
}`;
}

module.exports = {
  phpTemplate,
  jsonTemplate
}