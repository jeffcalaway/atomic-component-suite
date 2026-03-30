const vscode = require('vscode');
const generateReactComponentFiles = require('../commands/generateReactComponentFiles');
const generateReactBoilerplateFiles = require('../commands/generateReactBoilerplateFiles');

function registerComponentMenu(context) {
  // Register the "Generate Files for a React Component" command
  const componentFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateReactComponentFiles',
    (folder) => {
      generateReactComponentFiles(folder);
    }
  );

  // Register the "Generate Files from a Boilerplate" command
  const boilerplateFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateReactBoilerplateFiles',
    (folder) => {
      generateReactBoilerplateFiles(folder);
    }
  );

  // Add commands to the context subscriptions
  context.subscriptions.push(componentFilesCommand, boilerplateFilesCommand);
}

module.exports = registerComponentMenu;
