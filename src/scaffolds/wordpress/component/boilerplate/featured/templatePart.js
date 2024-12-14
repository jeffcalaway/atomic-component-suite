const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.scss`;
}

const fileContent = function (file) {
    const folderName = syntax.getName(file);
    const dirName    = syntax.getDirName(file);
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

module.exports = {
    filePath,
    fileContent
}