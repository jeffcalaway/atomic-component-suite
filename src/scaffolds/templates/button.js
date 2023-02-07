const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const part = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className     = `${dirLetter}-${folderName}`;

  return `<?php
  $props->admit_props([
      'id',
      'text',
      'url',
      'target',
      'aria_label',
      'aria_controls',
      'type',
      'name',
      'is_disabled',
      'is_static'
  ]);

  $props->set_defaults([
      'type'        => 'button',
      'is_disabled' => false,
      'is_static'   => false
  ]);

  $props->set_attributes([
      'id',
      'target',
      'aria_label',
      'aria_controls',
      'name',
      'is_disabled' => 'disabled'
  ]);

  $class = $props->class([
      '${className}',
      '${className}--disabled' => $is_disabled,
      '${className}--static'   => $is_static
  ]);
?>

<?php if ($text) : ?>

  <?php ob_start(); ?>
      <?php echo $text; ?>
  <?php $content = ob_get_clean(); ?>

  <?php if ( $is_static ) : ?>

      <div class="<?php echo $class; ?>"><?php echo $content; ?></div>

  <?php elseif ( $url ) : ?>

      <a
          <?php echo $id_attr; ?>
          class="<?php echo $class; ?>"
          href="<?php echo $url; ?>"
          <?php echo $target_attr; ?>
          <?php echo $aria_label_attr; ?>
      ><?php echo $content;?></a>

  <?php else : ?>

      <button
          <?php echo $id_attr; ?>
          class="<?php echo $class; ?>"
          type="<?php echo $type; ?>"
          <?php echo $aria_label_attr; ?>
          <?php echo $aria_controls_attr; ?>
          <?php echo $name_attr; ?>
          <?php echo $disabled_attr; ?>
      ><?php echo $content; ?></button>
      
  <?php endif; ?>
<?php endif; ?>`;
}

const javascript = false;
const style      = false;
const stories      = false;

module.exports = {
  part,
  javascript,
  style,
  stories
}