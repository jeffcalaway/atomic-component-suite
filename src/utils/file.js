const vscode = require('vscode');
const fs     = require('fs');
const path   = require('path');

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

const write = function (filePath, content) {
  return fs.writeFileSync(filePath, content, 'utf8');
}

const exists = function (filePath) {
  return fs.existsSync(filePath);
}

// Get all files in a given directory
const getFiles = function (source) {
  if (typeof source === 'object' && source.fsPath) {
    source = source.fsPath;
  }

  try {
      return fs.readdirSync(source, { withFileTypes: true })
          .filter(dirent => dirent.isFile())
          .map(dirent => dirent.name);
  } catch (error) {
      console.error(`Error reading files from ${source}:`, error);
      return [];
  }
}

const getDirectory = function (source) {
  if (typeof source === 'object' && source.fsPath) {
    source = source.fsPath;
  }

  return path.dirname(source);
}

const getDirectories = function (source) {
  if (typeof source === 'object' && source.fsPath) {
    source = source.fsPath;
  }

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

    // Regex to match $props->admit_props([...])
    const regex = /\$props->admit_props\s*\(\s*\[\s*([\s\S]*?)\s*\]\s*\)/;
    const match = content.match(regex);

    if (match && match[1]) {
      let propsContent = match[1];

      // Step 1: Remove single-line comments (//...) and multi-line comments (/* ... */)
      propsContent = propsContent
        .replace(/\/\/.*$/gm, '')    // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

      // Step 2: Remove any trailing commas and unnecessary whitespace
      propsContent = propsContent
        .replace(/,\s*$/m, '') // Remove trailing comma at the end
        .trim();

      // Step 3: Use a regex to match all quoted strings within the array
      const stringRegex = /['"]([^'"]+)['"]/g;
      const props = [];
      let stringMatch;

      while ((stringMatch = stringRegex.exec(propsContent)) !== null) {
        props.push(stringMatch[1].trim());
      }

      return props;
    } else {
      console.warn(`No matching props pattern found in file: ${filePath}`);
      return [];
    }
  } catch (error) {
    console.error(`Error reading props from ${filePath} (getProps):`, error);
    return [];
  }
};

const getRootPath = () => {
  return path.dirname(path.dirname(__dirname));
}

const getAssetsPath = (folderPath = '') => {
 return path.join(getRootPath(), `assets`, folderPath);
}

const getAsset = (file, folderPath = 'images') => {
  const assetsPath = getAssetsPath(folderPath);
  return path.join(assetsPath, file);
}

const isImage = (file) => {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i.test(file);
}

function getProjectPath(file) {
  const fileDir = getDirectory(file);
  const dirDir = getDirectory(fileDir);

  return dirDir;
}

function getProjectNamespace(file) {
  const projectPath = getProjectPath(file);
  const functionsPath = path.join(projectPath, 'functions.php');
  console.log( 'functionsPath', functionsPath );
  try {
    // Resolve the absolute path to handle relative paths correctly
    const absolutePath = path.resolve(functionsPath);

    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      console.warn(`File does not exist: ${absolutePath}`);
      return null;
    }

    // Read the file content as UTF-8
    const content = fs.readFileSync(absolutePath, 'utf8');

    // Regular expression to match the namespace declaration
    // Explanation:
    // - ^\s*         : Start of a line, followed by any whitespace
    // - namespace\s+ : The keyword 'namespace' followed by at least one space
    // - ([^;{]+)     : Capture group for namespace name (any characters except ';' or '{')
    // - [;{]         : Ends with either ';' or '{'
    const namespaceRegex = /^\s*namespace\s+([^;{]+)[;{]/mi;

    const match = content.match(namespaceRegex);

    if (match && match[1]) {
      // Trim any surrounding whitespace from the captured namespace name
      const namespace = match[1].trim();
      return namespace;
    } else {
      console.warn(`No namespace declaration found in file: ${absolutePath}`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading namespace from ${functionsPath} (getTopNamespace):`, error);
    return null;
  }
}

module.exports = {
  create,
  open,
  read,
  write,
  exists,
  getFiles,
  getDirectory,
  getDirectories,
  getProps,
  getRootPath,
  getAssetsPath,
  getAsset,
  isImage,
  getProjectNamespace
}