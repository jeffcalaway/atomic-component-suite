const fs = require('fs');
const path = require('path');

// Helper function to write a file
const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Generated: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
  }
};

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

          exports[targetName] = {
            ...moduleExports,
            generate: (folder) => {
              // Folder-based generate logic
              Object.values(moduleExports).forEach(({ filePath, filePrompt, fileContent }) => {
                if (filePath && fileContent) {
                  const outputFilePath = filePath(folder);
                  const outputContent = fileContent(folder, filePrompt(folder));

                  if (outputFilePath && outputContent) {
                    writeFile(outputFilePath, outputContent);
                  } else {
                    console.warn(`Missing filePath or fileContent in folder: ${targetName}`);
                  }
                }
              });
            }
          };
        } else {
          console.warn(`No index.js found in folder: ${targetName}`);
        }
      } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
        // Handle files
        const { filePath: getFilePath, filePrompt: runFilePrompt, fileContent: getFileContent } = require(targetPath);

        if (typeof getFilePath === 'function' && typeof getFileContent === 'function') {
          exports[targetName] = {
            generate: (folder) => {
              // File-based generate logic
              const outputFilePath = getFilePath(folder);
              const outputContent = getFileContent(folder, runFilePrompt(folder));

              if (outputFilePath && outputContent) {
                writeFile(outputFilePath, outputContent);
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