const prompts    = require('../utils/prompts');
const moduleUtil = require('../utils/module');
const path       = require('path');

const addToParentModule = async (uri) => {
  if (!uri || !uri.fsPath) {
    await prompts.errorMessage("No file selected.");
    return;
  }

  const childFilePath    = uri.fsPath;
  const childDir         = path.dirname(childFilePath);
  const parentDir        = path.dirname(childDir);
  const parentFolderName = path.basename(childDir);
  const parentFileName   = `class-${parentFolderName}.php`;
  const parentFilePath   = path.join(parentDir, parentFileName);

  moduleUtil.addToParentModule(parentFilePath, childFilePath);
}

module.exports = addToParentModule;
