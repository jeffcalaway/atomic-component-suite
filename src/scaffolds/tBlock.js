const { getName, getDirName } = require('../utils/syntax');

const template = function (file, props = []) {
  const folderName = getName(file);
  const dirName = getDirName(file);
  const componentPath = `${dirName}/${folderName}`;

  props = props || [];

  // Determine the longest var_name length for alignment of variable assignments
  const longestVarNameLength = props.length
    ? Math.max(...props.map(prop => prop.var_name.length))
    : 2;

  // Determine the longest prop_name length for alignment of arguments in render_template_part
  const longestPropNameLength = props.length
    ? Math.max(...props.map(prop => prop.prop_name.length))
    : 2;

  // Build variable declarations
  // Each line: $var_name (padded) = get_sub_field('field_name');
  const varSetup = props.length
    ? `<?php
${props.map(prop => {
  const varNamePadded = prop.var_name.padEnd(longestVarNameLength);
  return `    $${varNamePadded} = get_sub_field('${prop.field_name}');`;
}).join('\n')}
?>

`
    : '';

  // Build arguments for render_template_part
  // Each line: 'prop_name' (padded) => $var_name,
  const args = props.map(prop => {
    const propName = prop.prop_name;
    const propNamePadded = `'${propName}'`.padEnd(longestPropNameLength + 2); 
    // +2 for the quotes around propName
    // Example: prop_name = heading (7 chars) → 'heading' = 9 chars total
    // padEnd(longestPropNameLength+2) accounts for quotes length
    return `    ${propNamePadded} => $${prop.var_name},`;
  }).join('\n');

  return `${varSetup}<?php render_template_part('${componentPath}', [
${args}
]); ?>`;
}

module.exports = {
  template
}