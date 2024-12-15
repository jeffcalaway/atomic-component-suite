const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const prompts = require('../utils/prompts');

function generateModuleFiles(folder) {
  const folderPath = folder.fsPath;

  // Define module file templates
  const moduleFileTemplates = {
    'functions.php': 'common/functions.js',
    'class-setup.php': 'common/setup.js',
    'class-interface.php': 'common/interface.js',
    'class-hooks.php': 'common/hooks.js',
    'template-blocks.php': 'common/templateBlocks.js',
    'template-data.php': 'common/templateData.js',
  };

  // Prompt the user to select which files to generate
  prompts.pickMany(
    Object.keys(moduleFileTemplates),
    'Select Module Files to Generate',
    'Select one or more module files to generate'
  )
  .then((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      vscode.window.showInformationMessage('No files selected.');
      return;
    }

    selectedFiles.forEach((fileName) => {
      const templateFilePath = path.join(__dirname, '..', 'src', 'scaffolds', 'wordpress', 'includes', moduleFileTemplates[fileName]);
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

      vscode.window.showInformationMessage(`Generated ${fileName} successfully!`);
    });
  });
}

module.exports = generateModuleFiles;
