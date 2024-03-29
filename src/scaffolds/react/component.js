const format = require('../../utils/format');
const { getName, getDirName } = require('../../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName = getDirName(file);
  const dirLetter = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderKebab}`;

  return `import React from 'react'
import cn from 'classnames'

const ${folderClass} = props => {
  const {
    className,
    ...rest
  } = props

  const classBase = '${className}';
  const classes   = cn(classBase, className);

  return (
    <div className={classes} {...rest}>
    </div>
  )
}

export default ${folderClass}
`
}

module.exports = {
  template
}