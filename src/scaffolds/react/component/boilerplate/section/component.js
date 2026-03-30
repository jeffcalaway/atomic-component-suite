const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.js`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName     = syntax.getDirName(file);
  const dirLetter   = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderKebab}`;

  return `import classNames from '@utils/classNames';

const ${folderClass} = ({
  id,
  className,
  ...rest
}) => {
  const classBase = '${className}';
  const classes   = classNames(className, classBase);

  return (
    <section id={id} className={classes} {...rest}>
      <div className={\`\${classBase}__container u-container\`}>
        
      </div>
    </section>
  );
};

export default ${folderClass};
`
}

module.exports = {
    filePath,
    fileContent
}
