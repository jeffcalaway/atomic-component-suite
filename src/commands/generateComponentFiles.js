const prompts = require('../utils/prompts');
const components = require('../scaffolds/wordpress/component/common.js');

function generateComponentFiles(folder) {
  const fileTemplates = {
    'Template Part'   : 'templatePart',
    'Style'           : 'style',
    'Javascript'      : 'javascript',
    'Stories'         : 'stories',
    'Template Block'  : 'templateBlock',
    'Gutenberg Block' : {
      'JSON'  : 'gutenbergBlockJSON',
      'Block' : 'gutenbergBlock'
    }
  };

  prompts.pickMany(
    Object.keys(fileTemplates),
    'Select File Types to Generate',
    'Select one or more file types to generate'
  ).then((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      prompts.notification('No files selected.');
      return;
    }

    const includesTemplatePart = selectedFiles.includes('Template Part');

    // if includesTemplatePart is true, set 'Template Part' as the last file to generate
    if (includesTemplatePart) {
      selectedFiles = selectedFiles.filter((selected) => selected !== 'Template Part');
      selectedFiles.push('Template Part');
    }

    selectedFiles.forEach((selected) => {
      const componentKeyOrObject = fileTemplates[selected];

      let openAfterWrite = selected === selectedFiles[selectedFiles.length - 1] || (includesTemplatePart && selected === 'Template Part');

      if (typeof componentKeyOrObject === 'object') {
        const lastSubIndex = Object.keys(componentKeyOrObject).length - 1;
        // If the option generates multiple files
        Object.keys(componentKeyOrObject).forEach((subKey, subIndex) => {
          const subComponent = componentKeyOrObject[subKey];
          if (components[subComponent] && typeof components[subComponent].generate === 'function') {
            const openFromHere = openAfterWrite;
            // if openAfterWrite is true and there are subComponents, only open the last one
            const openFile = openFromHere && (subIndex === lastSubIndex);
            components[subComponent].generate(folder, openFile);
          } else {
            prompts.errorMessage(`No generator found for ${selected} - ${subKey}.`);
          }
        });
        prompts.notification(`Generated ${selected} successfully!`);
      } else {
        // If the option generates a single file
        const componentKey = componentKeyOrObject;
        if (components[componentKey] && typeof components[componentKey].generate === 'function') {
          components[componentKey].generate(folder, openAfterWrite);
          prompts.notification(`Generated ${selected} successfully!`);
        } else {
          prompts.errorMessage(`No generator found for ${selected}.`);
        }
      }
    });
  });
}

module.exports = generateComponentFiles;
