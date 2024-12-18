const vscode = require('vscode');
const fs     = require('fs');

const open = function (filePath) {
  vscode.workspace.openTextDocument(filePath).then(document => {
    vscode.window.showTextDocument(document);
  });
}

const create = function ( filePath, content, openAfterCreate = false ) {
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, content);
      console.log(`Generated: ${filePath}`);
    } catch (error) {
      console.error(`Error writing file: ${filePath}`, error);
    }

    if (openAfterCreate) {
      open(filePath);
    }
  }
}

const read = function (filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const exists = function (filePath) {
  return fs.existsSync(filePath);
}

const getDirectories = function (source) {
  try {
      return fs.readdirSync(source, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
  } catch (error) {
      console.error(`Error reading directories from ${source}:`, error);
      return [];
  }
}

const getProps = function (filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`);
      return [];
    }
  
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /\$props->admit_props\(\[\s*([\s\S]*?)\s*\]\)/;
    const match = content.match(regex);
  
    if (match && match[1]) {
      return match[1]
        .replace(/,\s*$/, '') // Remove trailing comma and whitespace
        .split(',')           // Split by comma
        .map(item => item.trim().replace(/['"]/g, '')); // Trim and remove quotes
    } else {
      console.warn(`No matching props pattern found in file: ${filePath}`);
      return [];
    }
  } catch (error) {
    console.error(`Error reading props from ${filePath} (getProps):`, error);
    return [];
  }
}

module.exports = {
  create,
  open,
  read,
  exists,
  getDirectories,
  getProps
}