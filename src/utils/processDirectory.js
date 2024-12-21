const fs = require('fs');
const path = require('path');
const file = require('./file');
const format = require('./format');
const prompts = require('./prompts');
const theme = require('./theme');

// Generic function to process a directory and generate exports
const processDirectory = (directoryPath = null, defaultDirectoryName = null) => {
  const resolvedPath = directoryPath || path.join(__dirname, defaultDirectoryName || path.basename(__filename, '.js'));

  return fs.readdirSync(resolvedPath, { withFileTypes: true })
    .reduce((exports, dirent) => {
      const targetName = dirent.name.replace('.js', ''); // Remove .js for files
      const targetPath = path.join(resolvedPath, dirent.name);

      if (dirent.isDirectory()) {
        // Handle folders
        const indexPath = path.join(targetPath, 'index.js');

        if (file.exists(indexPath)) {
          const moduleExports = require(indexPath);

          Object.entries(moduleExports).forEach(([key, value]) => {
            const { filePath: getFilePath, filePrompt: runFilePrompt, fileContent: getFileContent } = value;

            if (typeof getFilePath === 'function' && typeof getFileContent === 'function') {
              if (!exports[targetName]) {
                exports[targetName] = {}; // Initialize if not already done
              }
              
              exports[targetName][key] = {
                ...value,
                generate: async (folder, openAfterWrite = false, moduleFilePathToAddTo = false) => {
                  let prompt;
                  if (typeof runFilePrompt === 'function') {
                    prompt = await runFilePrompt(folder);
                    if (prompt === undefined) return;
                  }

                  const outputFilePath = getFilePath(folder, prompt);
                  const fileName       = outputFilePath.split('/').pop();

                  if (!file.exists(outputFilePath)) {
                    const outputContent = getFileContent(folder, prompt);
                
                    if (outputFilePath && outputContent) {
                      file.create(outputFilePath, outputContent, openAfterWrite);
                      prompts.fileCreated(outputFilePath);

                      if (moduleFilePathToAddTo) {
                        const addToParent = await prompts.confirm(`Would you like to add "${fileName}" to the parent module?`, {modal: true});
    
                        if (addToParent == 'Yes') {
                          theme.addToParentModule(moduleFilePathToAddTo, outputFilePath);
                        }
                      }
                      return true;
                    } else {
                      prompts.errorMessage(`Missing filePath or fileContent in export: ${key}`);
                    }
                  } else {
                    prompts.notification(`Skipped ${fileName}. File already exists.`);
                    return false;
                  }
                }
              };
            } else {
              prompts.errorMessage(`File ${targetName} does not export filePath or fileContent as functions.`);
            }
          });
        } else {
          prompts.errorMessage(`No index.js found in folder: ${targetName}`);
        }
      } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
        // Handle files
        const { filePath: getFilePath, filePrompt: runFilePrompt, fileContent: getFileContent } = require(targetPath);

        if (typeof getFilePath === 'function' && typeof getFileContent === 'function') {
          exports[targetName] = {
            ...require(targetPath),
            generate: async (folder, openAfterWrite = false, moduleFilePathToAddTo = false) => {
              let prompt;
              if (typeof runFilePrompt === 'function') {
                prompt = await runFilePrompt(folder);
                // if (prompt === undefined) return;
              }

              // File-based generate logic
              const outputFilePath = getFilePath(folder, prompt);
              const fileName       = outputFilePath.split('/').pop();

              if (!file.exists(outputFilePath)) {
                const outputContent = getFileContent(folder, prompt);

                if (outputFilePath && outputContent) {
                  file.create(outputFilePath, outputContent, openAfterWrite);
                  
                  prompts.fileCreated(outputFilePath);

                  const fileNiceName = format.toCapsAndSpaces(fileName.replace('class-','').replace('.php', ''));

                  if (moduleFilePathToAddTo) {
                    const addToParent = await prompts.confirm(`Would you like to add "${fileNiceName}" to the parent module?`, {modal: true});

                    if (addToParent == 'Yes') {
                      theme.addToParentModule(moduleFilePathToAddTo, outputFilePath);
                    }
                  }

                  return true;
                } else {
                  prompts.errorMessage(`Missing filePath or fileContent in file: ${targetName}`);
                }
              } else {
                prompts.notification(`Skipped ${fileName}. File already exists.`);
                return false;
              }
            }
          };
        } else {
          prompts.errorMessage(`File ${targetName} does not export filePath or fileContent as functions.`);
        }
      }

      return exports;
    }, {});
};

module.exports = processDirectory;