const vscode = require('vscode');
const fs = require('fs');
const { getName, getDirName } = require('../utils/syntax');

const template = function (file) {
  const folderName = getName(file);
  const dirName = getDirName(file);
  const filePath = file.fsPath;
  const partUri = `${filePath}/${folderName}`;
  const partPath = `${partUri}.php`;
  let props = [];

  if (partPath) {
    const content = fs.readFileSync(partPath, 'utf8');
    const regex = /\$props->admit_props\(\[\s*([\s\S]*?)\s*\]\)/;
    const match = content.match(regex);

    if (match) {
      props = match[1].split(',').map(item => item.trim().replace(/['"]/g, ''));
      props = props.filter(item => item !== 'id');
    }
  } else {
    vscode.window.showErrorMessage('No valid file found.');
  }

  const componentPath = `${dirName}/${folderName}`;

  // Calculate maximum key length, including 'id'
  const maxKeyLength = Math.max(...props.map(prop => prop.length), 2);

  const pad = (key, extra = 0) => key.padEnd(maxKeyLength + extra);

  return `<?php
    $${pad('id')} = get_sub_field('anchor_tag');
${props.map(prop => `    $${pad(prop)} = get_sub_field('${prop}');`).join('\n')}
?>

<?php render_template_part('${componentPath}', [
    ${pad(`'id'`, 2)} => $${pad('id')},
${props.map(prop => `    ${pad(`'${prop}'`, 2)} => $${prop},`).join('\n')}
]); ?>`;
}

module.exports = {
  template
}
