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

const input = async (label, placeholder = null) => {
  return await vscode.window.showInputBox({
    prompt: label,
    placeHolder: placeholder
  });
}

const form = async (fields) => {
  const form = {};
  const totalSteps = fields.length;

  for (let i = 0; i < totalSteps; i++) {
    const field = fields[i];
    const step = i + 1;
    field.label = `${field.label} (${step}/${totalSteps})`;
    const input = await input(field.label, field.placeholder);
    if (!input) return;
    form[field.name || field.label] = input;
  }
  return form;
}

const notification = async (text, options, ...buttons) => {
  return await vscode.window.showInformationMessage(text, options, ...buttons);
}

const confirm = async (text, options) => {
  return await notification(text, options, 'Yes', 'No');
}

const errorMessage = async (text, options, ...buttons) => {
  return await vscode.window.showErrorMessage(text, options, ...buttons);
}

module.exports = {
  pickOne,
  pickMany,
  input,
  form,
  notification,
  confirm,
  errorMessage
}