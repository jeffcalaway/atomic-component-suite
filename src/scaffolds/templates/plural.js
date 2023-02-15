const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const part = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className     = `${dirLetter}-${folderName}`;
  
  const singularName = format.toSingular(folderName);
  const itemPath     = `molecules/${singularName}`;

  const words    = singularName.split("-");
  let   lastWord = words.pop();
        lastWord = format.toSingular(lastWord);

  return `<?php
    $props->admit_props([
        'items'
    ]);

    extract($props->to_array());

    $class = $props->class([
        '${className}'
    ]);
?>

<?php if ( $items ) : ?>
    <div class="<?php echo $class; ?>">
        <ul class="${className}__list">

            <?php foreach ( $items as $item ) : ?>

                <?php
                    $keys = [
                        
                    ];
                    $item = array_only($item, $keys, null);
                ?>

                <?php if ( $item['SET_CONDITIONAL_KEY_HERE'] ) : ?>
                    <li class="${className}__item">
                        <?php render_template_part('${itemPath}', array_merge($item, [
                            'class' => '${className}__${lastWord}'
                        ])); ?>
                    </li>
                <?php endif; ?>

            <?php endforeach; ?>
        </ul>
  </div>
<?php endif; ?>`;
}

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

const style      = false;
const javascript = false;

module.exports = {
  part,
  style,
  javascript,
  stories
}