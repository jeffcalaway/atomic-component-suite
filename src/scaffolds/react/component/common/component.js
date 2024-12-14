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

  return `import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './${folderClass}.scss';

const ${folderClass} = ({
  className,
  ...rest
}) => {
  const classBase = '${className}';
  const classes   = clsx(classBase, className);

  return (
    <div className={classes} {...rest}>
    </div>
  )
}

${folderClass}.propTypes = {
  className: PropTypes.string,
}

export default ${folderClass}
`
}

module.exports = {
    filePath,
    fileContent
}