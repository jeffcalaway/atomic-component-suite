const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');
const storiesScaffold         = require('../../scaffolds/stories');

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

<section
    <?php echo $id_attr; ?>
    class="<?php echo $class; ?>"
>
    <div class="${className}__container u-container">
        
    </div>
</section>`;
}

const style = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className     = `${dirLetter}-${folderName}`;

  return `.${className} {
    @include theme-margins;
}`;
}

const javascript = false;
const stories    = (file) => storiesScaffold.template(file);

module.exports = {
  part,
  javascript,
  style,
  stories
}