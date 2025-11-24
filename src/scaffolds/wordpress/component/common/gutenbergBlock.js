const syntax  = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');
const fileUtil = require('../../../../utils/file');

const filePath = function (file) {
  const folderName = syntax.getName(file);
  const targetPath = file.fsPath;
  return `${targetPath}/${folderName}.block.php`;
}

const filePrompt = async function (file, passedValue = false) {
  if (passedValue) return passedValue;
  
  const templatePartPath = syntax.getFile(file, '.php');
  let options = [];

  let props = fileUtil.getProps(templatePartPath);

  if (!props || !props.length) return;

  options = props.map(item => {
    const itemValue = item.trim().replace(/['"]/g, '');
    return {
      label: itemValue,
      value: {
        propName  : itemValue,
        varName   : itemValue,
        fieldName : itemValue
      }
    };
  });

  options.push(
    {
      label: 'custom_class',
      value: {
        varName: 'custom_class',
        propName: 'class',
        value: 'get_block_class($block)'
      }
    }
  );

  // check if templatePartPath has the string 'organism' in it
  if (templatePartPath.includes('organism')) {
    options.filter(option => option.value.propName !== 'id');
    options = [
      {
        label: 'anchor_tag',
        value: {
          varName: 'id',
          propName: 'id',
          value: 'get_block_id($block)'
        }
      },
      ...options
    ];
  }

  if (!options.length) return;

  const selected = await prompts.pickMany(
    options,
    'Generate Gutenberg Block',
    'Select which props you would like to pass',
  );

  if (selected === undefined) return undefined;

  if (!selected) return;

  // get only the value of the options
  const selectedValues = selected.map(option => option.value);

  return selectedValues;
}

const fileContent = function (file, props) {
  const folderName = syntax.getName(file);
  const dirName = syntax.getDirName(file);
  const componentPath = `${dirName}/${folderName}`;

  props = (props && props.length) ? props : [];
  
  let variables = props;

  // Determine the longest varName length for alignment of variable assignments
  const longestVarNameLength = variables.length
  ? Math.max(...variables.map(prop => prop.varName.length))
  : 2;

  // Determine the longest propName length for alignment of arguments in render_template_part
  const longestPropNameLength = props.length
    ? Math.max(...props.map(prop => prop.propName.length))
    : 2;

  // Build variable declarations
  // Each line: $varName (padded) = get_sub_field('fieldName');
  const varSetup = variables.length
    ? `<?php
${variables.map(variable => {
  const varNamePadded = variable.varName.padEnd(longestVarNameLength);

  if (variable.value) {
    return `    $${varNamePadded} = ${variable.value};`;
  }

  return `    $${varNamePadded} = get_block_field( '${variable.fieldName}', $block );`;
}).join('\n')}
?>

`
    : '';

  // Build arguments for render_template_part
  // Each line: 'propName' (padded) => $varName,
  const args = props.map(prop => {
    const propName = prop.propName;
    const propNamePadded = `'${propName}'`.padEnd(longestPropNameLength + 2); 
    // +2 for the quotes around propName
    // Example: propName = heading (7 chars) → 'heading' = 9 chars total
    // padEnd(longestPropNameLength+2) accounts for quotes length
    return `    ${propNamePadded} => $${prop.varName},`;
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