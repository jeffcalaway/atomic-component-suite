const format = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName = getDirName(file);
  const dirLetter = format.toFirstLetter(dirName);

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
  template
}