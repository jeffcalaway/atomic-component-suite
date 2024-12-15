const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const prompts = require('../utils/prompts');

function generatePostTypeFiles(folder) {
  const folderPath = folder.fsPath;

  // Define post type file templates
  const postTypeFileTemplates = {
    'functions.php': 'postType/functions.js',
    'class-setup.php': 'postType/setup.js',
    'class-interface.php': 'postType/interface.js',
    'template-blocks.php': 'common/templateBlocks.js',
    'template-data.php': 'common/templateData.js',
  };

  // Prompt the user to select which files to generate
  prompts.pickMany(
    Object.keys(postTypeFileTemplates),
    'Select Post Type Files to Generate',
    'Select one or more post type files to generate'
  )
  .then((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      vscode.window.showInformationMessage('No files selected.');
      return;
    }

    selectedFiles.forEach((fileName) => {
      const templateFilePath = path.join(__dirname, '..', 'src', 'scaffolds', 'wordpress', 'includes', postTypeFileTemplates[fileName]);
      const targetFilePath = path.join(folderPath, fileName);

      // Check if template exists
      if (!fs.existsSync(templateFilePath)) {
        vscode.window.showErrorMessage(`Template for ${fileName} not found.`);
        return;
      }

      // Read the template content
      const templateContent = fs.readFileSync(templateFilePath, 'utf8');

      // Write the content to the target file
      fs.writeFileSync(targetFilePath, templateContent);

      vscode.window.showInformationMessage(`Generated ${fileName} for Post Type successfully!`);
    });
  });
}

module.exports = generatePostTypeFiles;
