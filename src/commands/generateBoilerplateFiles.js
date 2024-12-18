const format = require('../utils/format');
const prompts = require('../utils/prompts');
const boilerplates = require('../scaffolds/wordpress/component/boilerplate.js');

async function generateBoilerplateFiles(folder) {
  const boilerplateFolders = Object.keys(boilerplates);
  const boilerplateOptions = boilerplateFolders.map((folderName) => {
    return {
      label: format.toCapsAndSpaces(folderName),
      value: folderName
    };
  });

  const selectedBoilerplate = await prompts.pickOne(
    boilerplateOptions,
    'Select a Boilerplate',
    'Select a boilerplate to generate files from'
  );

  if (!selectedBoilerplate) {
    await prompts.notification('No boilerplate selected.');
    return;
  }

  const boilerplate = boilerplates[selectedBoilerplate.value];
  const boilerplateKeys = Object.keys(boilerplate);
  const lastFileIndex = boilerplateKeys.length - 1;

  for (let index = 0; index < boilerplateKeys.length; index++) {
    const key = boilerplateKeys[index];
    const boilerplateFile = boilerplate[key];
    if (boilerplateFile && typeof boilerplateFile.generate === 'function') {
      const openFile = index === lastFileIndex;
      try {
        await boilerplateFile.generate(folder, openFile);
      } catch (error) {
        await prompts.errorMessage(`Error generating ${key}: ${error.message}`);
      }
    } else {
      await prompts.errorMessage(`No generator found for ${key}.`);
    }
  }
}

module.exports = generateBoilerplateFiles;
