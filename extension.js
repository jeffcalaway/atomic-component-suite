const vscode = require('vscode');
const registerIncludesMenu = require('./src/menus/includesMenu');
const registerTemplatePartsMenu = require('./src/menus/templatePartsMenu');
const addToParentModule = require('./src/commands/addToParentModule');
const addToThemeFunctions = require('./src/commands/addToThemeFunctions');

function activate(context) {
  registerIncludesMenu(context);
  registerTemplatePartsMenu(context);

  let addToParentModuleSub = vscode.commands.registerCommand('atomic-component-generator.addToParentModule', async (uri) => {
    await addToParentModule(uri);
  });

  let addToThemeFunctionsSub = vscode.commands.registerCommand('atomic-component-generator.addToThemeFunctions', async (uri) => {
    await addToThemeFunctions(uri);
  });

  context.subscriptions.push(addToParentModuleSub);
  context.subscriptions.push(addToThemeFunctionsSub);
}

module.exports = {
    activate
};
