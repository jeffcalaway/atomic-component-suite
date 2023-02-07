const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const part = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

  return `<?php
  $props->admit_props([
      'id',
  ]);

  $props->set_attributes([
      'id'
  ]);

  extract($props->to_array());

  $class = $props->class([
      '${className}'
  ]);
?>

<?php if ( $items ) : ?>
  <header
      <?php echo $id_attr; ?>
      class="<?php echo $class; ?>"
  >
      <div class="${className}__container u-container">
          
      </div>
  </header>
<?php endif; ?>`;
}

const style      = false;
const javascript = false;
const stories    = false;

module.exports = {
  part,
  javascript,
  style,
  stories
}