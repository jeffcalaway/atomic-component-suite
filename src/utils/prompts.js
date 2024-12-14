const vscode = require('vscode');

const pickOne = async (options, title = null, placeholder = null) => {
  const args = {
    canPickMany: false
  }
  if (title) args.title = title;
  if (placeholder) args.placeHolder = placeholder;

  return await vscode.window.showQuickPick(options, args);
}

const pickMany = async (options, title = null, placeholder = null) => {
  const args = {
    canPickMany: true
  }
  if (title) args.title = title;
  if (placeholder) args.placeHolder = placeholder;

  return await vscode.window.showQuickPick(options, args);
}

module.exports = {
  pickOne,
  pickMany
}