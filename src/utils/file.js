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

  let targetPath = functionsPath;

  // Check if 'functions.php' exists
  if (!exists(functionsPath)) {
    console.warn(`File does not exist: ${functionsPath}`);

    // Get the name of the project directory
    const projectDirName = path.basename(projectPath);
    const alternativePath = path.join(projectPath, `${projectDirName}.php`);

    // Check if the alternative PHP file exists
    if (exists(alternativePath)) {
      console.info(`Using alternative file: ${alternativePath}`);
      targetPath = alternativePath;
    } else {
      console.warn(`Neither 'functions.php' nor '${projectDirName}.php' found in ${projectPath}.`);
      return null;
    }
  } else {
    console.info(`Found 'functions.php' at: ${functionsPath}`);
  }

  try {
    // Resolve the absolute path to handle relative paths correctly
    const absolutePath = path.resolve(targetPath);

    // Read the file content as UTF-8
    const content = read(absolutePath);

    // Regular expression to match the namespace declaration
    const namespaceRegex = /^\s*namespace\s+([^;{]+)[;{]/mi;

    const match = content.match(namespaceRegex);

    if (match && match[1]) {
      // Trim any surrounding whitespace from the captured namespace name
      const namespace = match[1].trim();
      console.info(`Namespace found: ${namespace}`);
      return namespace;
    } else {
      console.warn(`No namespace declaration found in file: ${absolutePath}`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading namespace from ${targetPath} (getProjectNamespace):`, error);
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
  getProjectPath,
  getProjectNamespace
}