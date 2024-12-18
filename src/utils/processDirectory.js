const fs = require('fs');
const path = require('path');
const file = require('./file');

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

        if (fs.existsSync(indexPath)) {
          const moduleExports = require(indexPath);

          Object.entries(moduleExports).forEach(([key, value]) => {
            const { filePath: getFilePath, filePrompt: runFilePrompt, fileContent: getFileContent } = value;

            if (typeof getFilePath === 'function' && typeof getFileContent === 'function') {
              if (!exports[targetName]) {
                exports[targetName] = {}; // Initialize if not already done
              }
              
              exports[targetName][key] = {
                ...value,
                generate: async (folder, openAfterWrite = false) => {
                  const outputFilePath = getFilePath(folder);
                  let prompt;
                  if (typeof runFilePrompt === 'function') {
                    prompt = await runFilePrompt(folder);
                  }
                  const outputContent = getFileContent(folder, prompt);
              
                  if (outputFilePath && outputContent) {
                    file.create(outputFilePath, outputContent, openAfterWrite);
                  } else {
                    console.warn(`Missing filePath or fileContent in export: ${key}`);
                  }
                }
              };
            } else {
              console.warn(`File ${targetName} does not export filePath or fileContent as functions.`);
            }
          });
        } else {
          console.warn(`No index.js found in folder: ${targetName}`);
        }
      } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
        // Handle files
        const { filePath: getFilePath, filePrompt: runFilePrompt, fileContent: getFileContent } = require(targetPath);

        if (typeof getFilePath === 'function' && typeof getFileContent === 'function') {
          exports[targetName] = {
            ...require(targetPath),
            generate: async (folder, openAfterWrite = false) => {
              // File-based generate logic
              const outputFilePath = getFilePath(folder);
              let prompt;
              if (typeof runFilePrompt === 'function') {
                prompt = await runFilePrompt(folder);
              }
              const outputContent = getFileContent(folder, prompt);

              if (outputFilePath && outputContent) {
                file.create(outputFilePath, outputContent, openAfterWrite);
              } else {
                console.warn(`Missing filePath or fileContent in file: ${targetName}`);
              }
            }
          };
        } else {
          console.warn(`File ${targetName} does not export filePath or fileContent as functions.`);
        }
      }

      return exports;
    }, {});
};

module.exports = processDirectory;