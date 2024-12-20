const vscode = require('vscode');
const registerIncludesMenu = require('./src/menus/includesMenu');
const registerTemplatePartsMenu = require('./src/menus/templatePartsMenu');
const addToParentModule = require('./src/commands/addToParentModule');

function activate(context) {
  registerIncludesMenu(context);
  registerTemplatePartsMenu(context);

  let disposable = vscode.commands.registerCommand('atomic-component-generator.addToParentModule', async (uri) => {
    await addToParentModule(uri);
  });

  context.subscriptions.push(disposable);
}

module.exports = {
    activate
};
