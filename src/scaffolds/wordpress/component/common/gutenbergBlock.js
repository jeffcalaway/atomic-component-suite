const syntax  = require('../../../../../utils/syntax');
const prompts = require('../../../../../utils/prompts');
const fs      = require('fs');

const filePath = function (file) {
  const folderName = syntax.getName(file);
  const targetPath = file.fsPath;
  return `${targetPath}/${folderName}.block.php`;
}

const filePrompt = function (file) {
  const templatePartPath = syntax.getFile(file, '.php');
  let options = [];

  if (fs.existsSync(templatePartPath)) {
    const content = fs.readFileSync(templatePartPath, 'utf8');
    const regex = /\$props->admit_props\(\[\s*([\s\S]*?)\s*\]\)/;
    const match = content.match(regex);

    if (match) {
      options = match[1].replace(/,\s*$/, '').split(',').map(item => {
        const itemValue = item.trim().replace(/['"]/g, '');
        return {
          label: itemValue,
          value: {
            prop_name  : itemValue,
            var_name   : itemValue,
            field_name : itemValue
          }
        };
      });
    }
  }

  // check if templatePartPath has the string 'organism' in it
  if (templatePartPath.includes('organism')) {
    options.filter(option => option.value.prop_name !== 'id');
    options = [
      {
        label: 'anchor_tag',
        value: {
          var_name: 'id',
          prop_name: 'id',
          value: '$is_gutenberg ? get_isset_val($block, \'anchor\'): get_acf_field_value(\'anchor_tag\')'
        }
      },
      ...options
    ];
  }

  if (!options.length) return;

  const selected = prompts.pickMany(
    options,
    'Generate Gutenberg Block',
    'Select which props you would like to pass',
  );

  if (!selected) return;

  // get only the value of the options
  const selectedValues = selected.map(option => option.value);

  return selectedValues;
}

const fileContent = function (file, props) {
  const folderName = syntax.getName(file);
  const dirName = syntax.getDirName(file);
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

module.exports = {
  filePath,
  filePrompt,
  fileContent
}