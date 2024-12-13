const format                  = require('../utils/format');
const { getName, getDirName } = require('../utils/syntax');

const phpTemplate = function (file, props = []) {
  const folderName = getName(file);
  const dirName = getDirName(file);
  const componentPath = `${dirName}/${folderName}`;

  props = props || [];
  
  let variables = [
    {
      var_name: 'is_gutenberg',
      value: 'isset($block)',
    },
    ...props
  ];

  // Determine the longest var_name length for alignment of variable assignments
  const longestVarNameLength = variables.length
  ? Math.max(...variables.map(prop => prop.var_name.length))
  : 2;

  // Determine the longest prop_name length for alignment of arguments in render_template_part
  const longestPropNameLength = props.length
    ? Math.max(...props.map(prop => prop.prop_name.length))
    : 2;

  // Build variable declarations
  // Each line: $var_name (padded) = get_sub_field('field_name');
  const varSetup = variables.length
    ? `<?php
${variables.map(variable => {
  const varNamePadded = variable.var_name.padEnd(longestVarNameLength);

  if (variable.value) {
    return `    $${varNamePadded} = ${variable.value};`;
  }

  return `    $${varNamePadded} = get_acf_field_value( '${variable.field_name}', $is_gutenberg );`;
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

const jsonTemplate = function (file) {
  const folderName  = getName(file);
  const folderTitle = format.toCapsAndSpaces(folderName);
  const dirName     = getDirName(file);

  return `{
    "name": "${dirName}/${folderName}",
    "title": "${folderTitle}",
    "description": "${folderTitle} module.",
    "category": "theme",
    "apiVersion": 2,
    "acf": {
        "mode": "preview",
        "renderTemplate": "template-parts/${dirName}/${folderName}/${folderName}.block.php"
    },
    "supports": {
        "anchor": true
    }
}`;
}

module.exports = {
  phpTemplate,
  jsonTemplate
}