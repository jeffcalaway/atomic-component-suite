const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

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

const stories = function (file) {
  const folderName  = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const folderClass = format.toCapsAndSnake(folderName);
  const dirName     = getDirName(file);
  const dirTitle    = format.toCapsAndSpaces(dirName);

  return `<?php
  
  use Useful_Stories\\Library\\Stories;
    
  class ${folderClass} extends Stories {
      function __construct(){
          $this->title    = '${dirTitle}/${folderTitle}';
          $this->defaults = [
            'items' => array_fill(0,3,[
                
            ])
          ];
      }
  
      function template($args=[]) {
          $args = wp_parse_args($args, $this->defaults);
  
          render_template_part('${dirName}/${folderName}', $args);
      }
    
      function initialize() {
          $default = $this->add_story('Default', [$this, 'template']);
      }
  }`;
}

module.exports = {
  part,
  javascript,
  style,
  stories
}