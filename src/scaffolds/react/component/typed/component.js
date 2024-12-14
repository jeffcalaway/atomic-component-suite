const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.ts`;
}

const fileContent = function (file) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName     = syntax.getDirName(file);
  const dirLetter   = format.toFirstLetter(dirName);

  const propConst = folderClass.charAt(0).toLowerCase() + folderClass.slice(1) + 'Props';

  const className = `${dirLetter}-${folderKebab}`;

  return `import React from 'react';
import cn from 'classnames';
import baseProps from '@interfaces/baseProps';

export interface ${propConst} extends baseProps {
  //text?: string
}

const ${folderClass} = (props: ${propConst}) => {
  const {
    className,
    ...rest
  } = props;

  const classBase = '${className}';
  const classes   = cn(classBase, className);

  return (
    <div className={classes} {...rest}>
    </div>
  );
};

export default ${folderClass};
`
}

module.exports = {
    filePath,
    fileContent
}