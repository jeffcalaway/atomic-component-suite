const prompts       = require('../utils/prompts');
const syntax        = require('../utils/syntax');
const fileUtil      = require('../utils/file');
const modules       = require('../scaffolds/wordpress/includes/taxonomy.js');
const commonModules = require('../scaffolds/wordpress/includes/common.js');

function generateTaxonomyFiles(folder) {
  const fileTemplates = {
    'Setup'           : 'setup',
    'Interface'       : 'interface',
    'Template Blocks' : 'templateBlocks',
    'Template Data'   : 'templateData',
    'Functions'       : 'functions',
    'Custom Class'    : 'customClass',
    'Parent Module'   : 'parentModule'
  };

  prompts.pickMany(
    Object.keys(fileTemplates),
    'Select Taxonomy Files to Generate',
    'Select one or more taxonomy files to generate'
  ).then((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      prompts.notification('No files selected.');
      return;
    }

    const includesParentModule = selectedFiles.includes('Parent Module');

    // if includesParentModule is true, set 'Parent Module' as the first file to generate
    if (includesParentModule) {
      selectedFiles = selectedFiles.filter((selected) => selected !== 'Parent Module');
      selectedFiles.unshift('Parent Module');
    }

    selectedFiles.forEach(async (selected) => {
      const moduleKeyOrObject = fileTemplates[selected];

      let openAfterWrite = selected === selectedFiles[selectedFiles.length - 1];

      if (typeof moduleKeyOrObject === 'object') {
        const lastSubIndex = Object.keys(moduleKeyOrObject).length - 1;
        // If the option generates multiple files
        Object.keys(moduleKeyOrObject).forEach( async (subKey, subIndex) => {
          const subModule = moduleKeyOrObject[subKey];

          const taxModule   = modules[subModule];
          let commonModule = {};
          if (!taxModule) commonModule = commonModules[subModule];

          if (
            (taxModule && typeof taxModule.generate === 'function') ||
            (commonModule && typeof commonModule.generate === 'function')
          ) {
            const openFromHere = openAfterWrite;
            // if openAfterWrite is true and there are subModules, only open the last one
            const openFile = openFromHere && (subIndex === lastSubIndex);

            const isModule = !['functions','interface','parentModule'].includes(subKey);

            let parentModulePath = false;

            if (isModule) {
              const folderPath = folder.fsPath;
              const folderName = syntax.getName(folderPath);
              const includesFolder = fileUtil.getDirectory(folderPath);
              parentModulePath = `${includesFolder}/class-${folderName}.php`;
            }

            if (taxModule) {
              taxModule.generate(folder, openFile, parentModulePath);
            } else {
              commonModule.generate(folder, openFile, parentModulePath);
            }
          } else {
            prompts.errorMessage(`No generator found for ${selected} - ${subKey}.`);
          }
        });
      } else {
        // If the option generates a single file
        const moduleKey = moduleKeyOrObject;

        const taxModule   = modules[moduleKey];
        let commonModule = {};
        if (!taxModule) commonModule = commonModules[moduleKey];

        if (
          (taxModule && typeof taxModule.generate === 'function') ||
          (commonModule && typeof commonModule.generate === 'function')
        ) {
          const isModule = !['functions','interface','parentModule'].includes(moduleKey);

          let parentModulePath = false;
          if (isModule) {
            const folderName = syntax.getName(folder);
            const includesFolder = fileUtil.getDirectory(folder);
            parentModulePath = `${includesFolder}/class-${folderName}.php`;
          }

          if (taxModule) {
            taxModule.generate(folder, true, parentModulePath);
          } else {
            commonModule.generate(folder, true, parentModulePath);
          }
        } else {
          prompts.errorMessage(`No generator found for ${selected}.`);
        }
      }
    });
  });
}

module.exports = generateTaxonomyFiles;
