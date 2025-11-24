const vscode = require('vscode');
const generateReactComponentFiles = require('../commands/generateReactComponentFiles');

function registerComponentMenu(context) {
  // Register the "Generate Files for a React Component" command
  const componentFilesCommand = vscode.commands.registerCommand(
    'atomic-component-generator.generateReactComponentFiles',
    (folder) => {
      generateReactComponentFiles(folder);
    }
  );

  // Add commands to the context subscriptions
  context.subscriptions.push(componentFilesCommand);
}

module.exports = registerComponentMenu;
