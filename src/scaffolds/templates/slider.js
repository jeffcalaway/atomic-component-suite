const format                  = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const part = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;

  const moleculePath = `molecules/SET_MOLECULE_NAME_HERE`;

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
                'class' => '${className}__list',
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

  const className     = `${dirLetter}-${folderName}`;

  return `.${className} {
    @include theme-margins;
}`;
}

const javascript = function (file) {
  const folderName = getName(file);
  const dirName    = getDirName(file);
  const dirLetter  = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderName}`;
  const ClassName = format.toCapsAndCamel(folderName);
  const fName     = format.toLowAndSnake(folderName);

  return `jQuery($ => {
    class ${ClassName} {
      constructor(element, args = {}) {
        this._        = element;
        this._element = $(element);
        this._list    = this._element.find('.${className}__list');

        this._args    = $.extend({
          slidesToShow  : 3,
          slidesToScroll: 1,
          arrows        : true
        }, args);
  
        this.init();
      }
  
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
      // ✅ Initialize
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  
      init() {
        this.setupHandlers();
        this._element.trigger( 'init', this );
      }
  
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
      // ✅ Setup Handlers
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  
      setupHandlers() {
        this.setupSlick();
      }

      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
      // ✅ Setup Slick
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

      setupSlick = () => {
        this._list.slick(this._args);
        this._element.trigger( 'slick-init', this );
      }
    }
  
    //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    // ✅ Setup jQuery Plugin
    //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  
    $.fn.${fName} = function() {
      var _ = this,
          opt = arguments[0],
          args = Array.prototype.slice.call(arguments, 1),
          l = _.length,
          i,
          ret;
      for (i = 0; i < l; i++) {
        if (typeof opt == 'object' || typeof opt == 'undefined')
          _[i].${fName} = new ${ClassName}(_[i], opt);
        else
          ret = _[i].${fName}[opt].apply(_[i].${fName}, args);
        if (typeof ret != 'undefined') return ret;
      }
      return _;
    }
  
    //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    // ✅ Run
    //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  
    $('.${className}').${fName}();
});`;
};

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