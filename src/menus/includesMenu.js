const vscode = require('vscode');
const generateModuleFiles = require('../commands/generateModuleFiles');
const generatePostTypeFiles = require('../commands/generatePostTypeFiles');
const generateTaxonomyFiles = require('../commands/generateTaxonomyFiles');

function registerIncludesMenu(context) {
  // Register the "Generate Files for a Module" command
  const moduleFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateModuleFiles',
    (folder) => {
      generateModuleFiles(folder);
    }
  );

  // Register the "Generate Files for a Post Type" command
  const postTypeFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generatePostTypeFiles',
    (folder) => {
      generatePostTypeFiles(folder);
    }
  );

  // Register the "Generate Files for a Taxonomy" command
  const taxonomyFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateTaxonomyFiles',
    (folder) => {
      generateTaxonomyFiles(folder);
    }
  );

  // Add commands to the context subscriptions
  context.subscriptions.push(moduleFilesCommand, postTypeFilesCommand, taxonomyFilesCommand);
}

module.exports = registerIncludesMenu;
