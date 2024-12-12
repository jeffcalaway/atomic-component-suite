const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');
const storiesScaffold         = require('../../scaffolds/stories');

const part = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

  let moleculeName = 'SET_MOLECULE_NAME_HERE';
  let lastWord     = 'SET_MOLECULE_CLASSNAME_HERE';

  if (folderName.startsWith("featured-")) {
    moleculeName = folderName.slice(9);

    const words    = moleculeName.split("-");
          lastWord = words.pop();
  }

  const moleculePath = `molecules/${moleculeName}`;

  return `<?php
    $props->admit_props([
        'id',
        'items'
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
    <section
        <?php echo $id_attr; ?>
        class="<?php echo $class; ?>"
    >
        <div class="${className}__container u-container">
            <?php render_template_part('${moleculePath}', [
                'class' => '${className}__${lastWord}',
                'items' => $items
            ]); ?>
        </div>
    </section>
<?php endif; ?>`;
}

const style = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

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