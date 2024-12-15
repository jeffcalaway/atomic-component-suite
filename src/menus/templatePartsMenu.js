const vscode = require('vscode');
const generateComponentFiles = require('../commands/generateComponentFiles');
const generateBoilerplateFiles = require('../commands/generateBoilerplateFiles');

function registerTemplatePartsMenu(context) {
  // Register the "Generate Files for a Component" command
  const componentFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateComponentFiles',
    (folder) => {
      generateComponentFiles(folder);
    }
  );

  // Register the "Generate Files from a Boilerplate" command
  const boilerplateFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateBoilerplateFiles',
    (folder) => {
      generateBoilerplateFiles(folder);
    }
  );

  // Add commands to the context subscriptions
  context.subscriptions.push(componentFilesCommand, boilerplateFilesCommand);
}

module.exports = registerTemplatePartsMenu;
