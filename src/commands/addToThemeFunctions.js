const prompts    = require('../utils/prompts');
const theme = require('../utils/theme');

const addToThemeFunctions = async (uri) => {
  if (!uri || !uri.fsPath) {
    await prompts.errorMessage("No file selected.");
    return;
  }

  const filePath = uri.fsPath;

  theme.addToThemeFunctions(filePath);
}

module.exports = addToThemeFunctions;
