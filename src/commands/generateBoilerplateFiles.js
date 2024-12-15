const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const prompts = require('../utils/prompts');

function generateBoilerplateFiles(folder) {
  // Define boilerplate templates and file names
  const boilerplateTemplates = {
    button: 'boilerplate/button.js',
    featured: 'boilerplate/featured.js',
    hero: 'boilerplate/hero.js',
    plural: 'boilerplate/plural.js',
    section: 'boilerplate/section.js',
    slider: 'boilerplate/slider.js',
  };

  // Get the folder path
  const folderPath = folder.fsPath;

  // Prompt the user to select a boilerplate type
  prompts.pickOne(
    Object.keys(boilerplateTemplates),
    'Select a Boilerplate Type',
    'Choose one of the boilerplate options...'
  )
  .then((selected) => {
    if (!selected) {
      vscode.window.showInformationMessage('No boilerplate selected.');
      return;
    }

    const templateFilePath = path.join(__dirname, '..', 'src', 'scaffolds', 'wordpress', 'component', boilerplateTemplates[selected]);

    // Check if the template file exists
    if (!fs.existsSync(templateFilePath)) {
      vscode.window.showErrorMessage(`Template file for ${selected} not found.`);
      return;
    }

    // Read the template content
    const templateContent = fs.readFileSync(templateFilePath, 'utf8');

    // Define the target file path
    const targetFilePath = path.join(folderPath, `${selected}.js`);

    // Write the content to the target file
    fs.writeFileSync(targetFilePath, templateContent);

    vscode.window.showInformationMessage(`${selected} boilerplate generated successfully!`);
  });
}

module.exports = generateBoilerplateFiles;
