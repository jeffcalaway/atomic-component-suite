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
        'rel',
        'aria_label',
        'aria_controls',
        'aria_owns',
        'aria_selected',
        'tabindex',
        'type',
        'name',
        'role',
        'rel',
        'is_disabled',
        'is_download',
        'is_inverted',
        'is_static',
    ]);

    $props->set_defaults([
        'type'        => 'button',
        'is_disabled' => false,
        'is_download' => false,
        'is_inverted' => false,
        'is_static'   => false,
    ]);

    $props->set_attributes([
        'id',
        'target',
        'rel',
        'aria_label',
        'aria_controls',
        'aria_owns',
        'aria_selected',
        'tabindex',
        'name',
        'role',
        'rel',
        'is_disabled' => 'disabled',
        'is_download' => 'download'
    ]);

    extract($props->to_array());

<<<<<<< HEAD
    if (boolval($url)) {
        $aria_label      = set_target_aria_label($target, $aria_label ?: $text);
        $aria_label_attr = attr('aria-label', $aria_label);

        $rel      = set_target_rel($target, $rel);
        $rel_attr = attr('rel', $rel);
    }

    $data_attrs = [];
    switch (gettype($data)) {
        case "string":
            $data_attrs[] = get_data_attr($data);
            break;
            
        case "array":
            $data_attrs = array_map('get_data_attr', array_keys($data), array_values($data));
            break;
=======
    if ($target === '_blank') {
        if ($aria_label) {
            $aria_label .= ' (opens in a new tab)';
        } else {
            $aria_label = $text . ' (opens in new tab)';
        }
        $aria_label_attr = attr('aria-label', $aria_label);
>>>>>>> 1580028ea71bd0c52fa2a16229df525a05980475
    }

    $class = $props->class([
        '${className}',
        '${className}--disabled' => $is_disabled,
        '${className}--download' => $is_download,
        '${className}--inverted' => $is_inverted,
        '${className}--static'   => $is_static,
    ]);
?>

<?php if ($text) : ?>

    <?php ob_start(); ?>
        <?php echo $text; ?>
    <?php $content = ob_get_clean(); ?>

    <?php if ( $is_static ) : ?>

        <div
            class="<?php echo $class; ?>"
            <?php echo join(' ', $data_attrs); ?>
        ><?php echo $content; ?></div>

    <?php elseif ( $url ) : ?>

        <a
            <?php echo $id_attr; ?>
            class="<?php echo $class; ?>"
            href="<?php echo $url; ?>"
            <?php echo $target_attr; ?>
            <?php echo $rel_attr; ?>
            <?php echo $aria_label_attr; ?>
            <?php echo $aria_controls_attr; ?>
            <?php echo $aria_owns_attr; ?>
            <?php echo $aria_selected_attr; ?>
            <?php echo $download_attr; ?>
            <?php echo $tabindex_attr; ?>
            <?php echo join(' ', $data_attrs); ?>
        ><?php echo $content;?></a>

    <?php else : ?>

        <button
            <?php echo $id_attr; ?>
            class="<?php echo $class; ?>"
            type="<?php echo $type; ?>"
            <?php echo $aria_label_attr; ?>
            <?php echo $aria_controls_attr; ?>
            <?php echo $aria_owns_attr; ?>
            <?php echo $aria_selected_attr; ?>
            <?php echo $tabindex_attr; ?>
            <?php echo $name_attr; ?>
            <?php echo $role_attr; ?>
            <?php echo join(' ', $data_attrs); ?>
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