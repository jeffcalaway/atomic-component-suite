const syntax  = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');
const fs      = require('fs');

const filePath = function (file) {
  const folderName = syntax.getName(file);
  const page_builder = syntax.getBuilderPath(file);
  return `${page_builder}/${folderName}.php`;
}

const filePrompt = async function (file) {
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
            propName  : itemValue,
            varName   : itemValue,
            fieldName : itemValue
          }
        };
      });
    }
  }

  // check if templatePartPath has the string 'organism' in it
  if (templatePartPath.includes('organism')) {
    options.filter(option => option.value.propName !== 'id');
    options = [
      {
        label: 'anchor_tag',
        value: {
          propName  : 'id',
          varName   : 'anchor_tag',
          fieldName : 'anchor_tag'
        }
      },
      ...options
    ];
  }

  if (!options.length) return;

  const selected = await prompts.pickMany(
    options,
    'Generate Template Block',
    'Select which props you would like to pass',
  );

  if (!selected) return;

  // get only the value of the selected options
  const selectedValues = selected.map(option => option.value);

  return selectedValues;
}

const fileContent = function (file, props) {
  const folderName = syntax.getName(file);
  const dirName = syntax.getDirName(file);
  const componentPath = `${dirName}/${folderName}`;

  props = (props && props.length) ? props : [];

  // Determine the longest varName length for alignment of variable assignments
  const longestVarNameLength = props.length
    ? Math.max(...props.map(prop => prop.varName.length))
    : 2;

  // Determine the longest propName length for alignment of arguments in render_template_part
  const longestPropNameLength = props.length
    ? Math.max(...props.map(prop => prop.propName.length))
    : 2;

  // Build variable declarations
  // Each line: $varName (padded) = get_sub_field('fieldName');
  const varSetup = props.length
    ? `<?php
${props.map(prop => {
  const varNamePadded = prop.varName.padEnd(longestVarNameLength);
  return `    $${varNamePadded} = get_sub_field('${prop.fieldName}');`;
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