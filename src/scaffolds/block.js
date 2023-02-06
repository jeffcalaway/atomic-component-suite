const format                  = require('../utils/format');
const { getName, getDirName } = require('../utils/syntax');

const phpTemplate = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);

  return `<?php
  $anchor_id = get_isset_val( $block, 'anchor' );
?>

<?php render_template_part('${dirName}/${folderName}', [
  'id' => $anchor_id,
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
        "mode": "auto",
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