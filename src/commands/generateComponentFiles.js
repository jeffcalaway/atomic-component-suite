const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const prompts = require('../utils/prompts');

function generateComponentFiles(folder) {
  const folderPath = folder.fsPath;

  // Define the files and their templates
  const fileTemplates = {
    '.php': 'common/templatePart.js',
    '.scss': 'common/style.js',
    '.js': 'common/javascript.js',
    '.stories.php': 'common/stories.js',
  };

  // Prompt the user to select which files to generate
  prompts.pickMany(
    Object.keys(fileTemplates),
    'Select File Types to Generate',
    'Select one or more file types to generate'
  )
  .then((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      vscode.window.showInformationMessage('No files selected.');
      return;
    }

    selectedFiles.forEach((fileExtension) => {
      const templateFilePath = path.join(__dirname, '..', 'src', 'scaffolds', 'wordpress', 'component', fileTemplates[fileExtension]);
      const targetFilePath = path.join(folderPath, `component${fileExtension}`);

      // Check if template exists
      if (!fs.existsSync(templateFilePath)) {
        vscode.window.showErrorMessage(`Template for ${fileExtension} not found.`);
        return;
      }

      // Read the template content
      const templateContent = fs.readFileSync(templateFilePath, 'utf8');

      // Write the content to the target file
      fs.writeFileSync(targetFilePath, templateContent);

      vscode.window.showInformationMessage(`Generated ${fileExtension} file successfully!`);
    });
  });
}

module.exports = generateComponentFiles;
