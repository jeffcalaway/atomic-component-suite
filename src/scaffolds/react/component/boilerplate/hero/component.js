const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');
const prompts = require('../../../../../utils/prompts');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.js`;
}

const filePrompt = async function (file, passedValue = false) {
    if (passedValue) return passedValue;

    const context = {};
    
    context.includeBreadcrumbs = await prompts.confirm('Would you like to add breadcrumbs to this hero?', {
      modal: true
    });
    
    return context;
}

const fileContent = function (file, context = {}) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName     = syntax.getDirName(file);
  const dirLetter   = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderKebab}`;

  let breadcrumbsImport = '';
  let breadcrumbsProp = '';
  let breadcrumbsCode = '';
  
  if (context && context.includeBreadcrumbs == 'Yes') {
    breadcrumbsImport = `
import Breadcrumbs from '@molecules/Breadcrumbs';`;
    breadcrumbsProp = `
  breadcrumbs,`;
    breadcrumbsCode = `
      {breadcrumbs && (
        <Breadcrumbs
          className={\`\${classBase}__breadcrumbs\`}
          items={breadcrumbs}
          isFloating
        />
      )}
`;
  }

  return `import classNames from '@utils/classNames';${breadcrumbsImport}

const ${folderClass} = ({
  id,
  className,${breadcrumbsProp}
  ...rest
}) => {
  const classBase = '${className}';
  const classes   = classNames(className, classBase);

  return (
    <header id={id} className={classes} {...rest}>${breadcrumbsCode}
      <div className={\`\${classBase}__container u-container\`}>
        
      </div>
    </header>
  );
};

export default ${folderClass};`
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}
