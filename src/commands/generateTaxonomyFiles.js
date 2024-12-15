const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const prompts = require('../utils/prompts');

function generateTaxonomyFiles(folder) {
  const folderPath = folder.fsPath;

  // Define taxonomy file templates
  const taxonomyFileTemplates = {
    'functions.php': 'taxonomy/functions.js',
    'class-setup.php': 'taxonomy/setup.js',
    'class-interface.php': 'taxonomy/interface.js',
    'template-blocks.php': 'common/templateBlocks.js',
    'template-data.php': 'common/templateData.js',
  };

  // Prompt the user to select which files to generate
  prompts.pickMany(
    Object.keys(taxonomyFileTemplates),
    'Select Taxonomy Files to Generate',
    'Select one or more taxonomy files to generate'
  )
  .then((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      vscode.window.showInformationMessage('No files selected.');
      return;
    }

    selectedFiles.forEach((fileName) => {
      const templateFilePath = path.join(__dirname, '..', 'src', 'scaffolds', 'wordpress', 'includes', taxonomyFileTemplates[fileName]);
      const targetFilePath = path.join(folderPath, fileName);

      // Check if the template exists
      if (!fs.existsSync(templateFilePath)) {
        vscode.window.showErrorMessage(`Template for ${fileName} not found.`);
        return;
      }

      // Read the template content
      const templateContent = fs.readFileSync(templateFilePath, 'utf8');

      // Write the content to the target file
      fs.writeFileSync(targetFilePath, templateContent);

      vscode.window.showInformationMessage(`Generated ${fileName} for Taxonomy successfully!`);
    });
  });
}

module.exports = generateTaxonomyFiles;
