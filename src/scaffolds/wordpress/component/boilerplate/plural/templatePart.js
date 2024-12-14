const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.php`;
}

const fileContent = function (file) {
  const folderName = syntax.getName(file);
  const dirName    = syntax.getDirName(file);
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

module.exports = {
    filePath,
    fileContent
}