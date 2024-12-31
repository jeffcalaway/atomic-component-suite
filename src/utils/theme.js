const file = require('./file');
const syntax = require('./syntax');
const format = require('./format');
const prompts = require('./prompts');
const path = require('path');

/**
 * Adds a child module to the parent PHP class file.
 * @param {string} parentFilePath - Path to the parent PHP file.
 * @param {string} childFilePath - Path to the child PHP file.
 */
function addToParentModule(parentFilePath, childFilePath) {
    try {
        // -----------------------------------------------------------
        // Step 1: Read Parent File
        // -----------------------------------------------------------
        const parentContent = file.read(parentFilePath);
  
        // -----------------------------------------------------------
        // Step 2: Extract Class and Namespace Details
        // -----------------------------------------------------------
        // We'll assume the parent filename looks like "class-Name.php"
        const parentFileName = syntax.getName(parentFilePath); // e.g. "class-Test.php"
        const parentName = format.removeClassAndPhp(parentFileName); 
        // Convert parentName to a Class_Name style (PascalCase)
        const parentClassName = format.toCapsAndSnake(parentName); // e.g. "Test" -> "Test"
  
        // -----------------------------------------------------------
        // Step 3: Extract Existing Public Variables
        // -----------------------------------------------------------
        // Matches lines like: public $hooks;
        const publicVarRegex = /^\s*public\s+\$(\w+);\s*$/gm;
        let match;
        const existingVars = [];
        while ((match = publicVarRegex.exec(parentContent)) !== null) {
            existingVars.push(match[1]); // e.g. "hooks"
        }
  
        // -----------------------------------------------------------
        // Step 4: Prepare Submodules Array
        // -----------------------------------------------------------
        // Child name derived from childFilePath
        const childFileName = syntax.getName(childFilePath); // e.g. "class-Hubspot.php"
        const rawChildName = format.removeClassAndPhp(childFileName); // e.g. "Hubspot"
        const childVarName = format.toLowAndSnake(rawChildName); // e.g. "hubspot"
  
        // Check if childVarName already exists in the parent file
        if (parentContent.includes(childVarName)) {
          prompts.notification("This module has already been added to the parent module");
          return; // Exit early
        }
  
        // Create the final submodules array. Start with existing variables, then add the new one.
        const submodules = [...existingVars, childVarName];
  
        // -----------------------------------------------------------
        // Step 5: Construct the Output Class File
        // -----------------------------------------------------------
        // For public variables: map submodules to lines like "public $hooks;"
        const publicVariablesSection = submodules
            .map(submodule => `    public $${submodule};`)
            .join('\n');
  
        // For initializations: map submodules to lines with alignment
        const initLeftSide = (item) => `        $this->${item}`;
        const initRightSide = (item) => {
          const submoduleClass = format.toCapsAndSnake(item);
          return `new ${parentClassName}\\${submoduleClass}();`;
        };
        const initializationsSection = format.alignByEqualSign(submodules, initLeftSide, initRightSide);
  
        // For modules: map submodules to lines like "$this->hooks"
        const modulesSection = submodules
            .map(submodule => `            $this->${submodule}`)
            .join(',\n');
  
        // -----------------------------------------------------------
        // Step 6: Rebuild the Entire File Using the Template
        // -----------------------------------------------------------
        const newContent = `<?php

namespace Useful_Group\\Includes;
    use Useful_Framework\\Library;

class ${parentClassName} extends Library\\Master {

${publicVariablesSection}

    public function initialize() {
        parent::initialize();
    }

    public function __construct() {
        parent::__construct();

${initializationsSection}

        $this->add_modules([
${modulesSection}
        ]);
    }
}
`;
  
        // -----------------------------------------------------------
        // Step 7: Write the Updated Content
        // -----------------------------------------------------------
        file.write(parentFilePath, newContent);
  
        // -----------------------------------------------------------
        // Step 8: Notify Success
        // -----------------------------------------------------------
        prompts.fileUpdated(parentFilePath, `Successfully added ${childVarName} to ${parentName}`);
  
    } catch (error) {
        // Notify of any errors
        prompts.errorMessage(`Error in addToParent: ${error.message}`);
    }
}


function addToThemeFunctions(filePath) {
    const fileName = format.removeClassAndPhp(syntax.getName(filePath));
    const fileVar  = format.toLowAndSnake(fileName);

    const isFunctionsFile = fileName === 'functions';

    let reference;
    if (isFunctionsFile) {
        const pathParts = filePath.split('/');
        const includesIndex = pathParts.indexOf('includes');
        const folderName = pathParts[includesIndex + 1];
        reference = `${folderName} functions file`;
    } else {
        reference = `${fileName} class file`;
    }

    const referencePath = isFunctionsFile ? file.getDirectory(filePath) : filePath;
    const projectPath = file.getProjectPath(referencePath);
    const functionsFilePath = path.join(projectPath, 'functions.php'); // This will be set to the actual path later.

    // Read file content into memory
    let functionsFileContent = file.read(functionsFilePath);
    
    // ---------------------------------------
    // STEP 1: Extract the modules
    // ---------------------------------------
    // We know the modules are defined in the constructor via $this->modules = [ ... ];
    // We need to:
    // 1) Find the line with "$this->autoloader" and the line with "];" that closes $this->modules.
    // 2) Extract the module variables from between these lines.
    // 3) Create a const projectModules array from these variable names (without $this->).

    // Find the constructor or simply search for $this->autoloader line
    const autoLoaderLineIndex = functionsFileContent.split('\n').findIndex(line => line.includes('$this->autoloader'));
    // Find the $this->modules array start and end
    
    let lines = functionsFileContent.split('\n');

    const modulesStartIndex = lines.findIndex(line => line.trim().startsWith('$this->modules = ['));

    // Find the line containing "if ( defined( 'WP_CLI' ) && WP_CLI ) {"
    const ifWpCliIndex = lines.findIndex(line => line.includes("if ( defined( 'WP_CLI' ) && WP_CLI ) {"));
    
    // Set modulesEndIndex to one line before the if-statement line
    const modulesEndIndex = ifWpCliIndex - 1;
    
    // Extract lines that form $this->modules = [ ... ];
    const modulesArrayLines = lines.slice(modulesStartIndex, modulesEndIndex + 1);

    // Example of a modules line: $this->modules = [
    //     $this->framework,
    //     $this->theme,
    //     ...
    // ];
    // We just need the variable names inside the array.
    const moduleVarPattern = /\$this->([a-zA-Z0-9_]+)/g;
    let moduleMatches = [];
    modulesArrayLines.forEach(l => {
        let match;
        while ((match = moduleVarPattern.exec(l)) !== null) {
            moduleMatches.push(match[1]); // The group after $this->
        }
    });

    // Now we have something like ["framework", "theme", "admin", ...]
    const projectModules = moduleMatches.slice(1);

    if (!isFunctionsFile) {
        if (projectModules.includes(fileVar)) {
            prompts.notification(`This module has already been added to the Theme Functions file`);
            return;
        } else {
            projectModules.push(fileVar);
        }
    }

    const getModuleVar = (module) => `$this->${module}`;
    const getInitModuleVar = (module) => `            ${getModuleVar(module)}`;
    const getListModuleVar = (module) => `                ${getModuleVar(module)}`;
    const getNewClass  = (module) => {
        const moduleClass = format.toCapsAndSnake(module);
        return `new Includes\\${moduleClass}();`;
    };

    const moduleInitializations = format.alignByEqualSign(projectModules, getInitModuleVar, getNewClass);

    const modulesArray = projectModules.map(getListModuleVar).join(',\n');

    const moduleSetup = '\n' + moduleInitializations + '\n\n            $this->modules = [\n' + modulesArray + '\n            ];\n';

    // ---------------------------------------
    // STEP 2: Replace lines between $this->autoloader and ]; that closes $this->modules
    // with "MODULE_SETUP"
    // ---------------------------------------

    // We know $this->autoloader line occurs before $this->modules definition lines.
    // We must find the block from just after the $this->autoloader line through the line before the $this->modules end line (just before "];")
    // Actually, the instructions: "replace all of the lines between the line with $this->autoloader and the ]; that closes the array for $this->modules".
    // This suggests we want to remove everything between the line after $this->autoloader and the line before the modules' closing ];.
    
    // Let's clarify: The $this->autoloader line comes before the block of $this->framework = new Includes\... lines and then eventually $this->modules = [ ... ];  
    // The instructions say: replace all lines between the line with "$this->autoloader" and the "];" that closes $this->modules array. 
    // This effectively replaces all module assignments plus the $this->modules array block with "MODULE_SETUP".
    // We will keep the line with "$this->autoloader" intact but replace everything after it up to and including the "];" line of $this->modules array.

    // Find the line with $this->autoloader
    const autoloaderIndex = autoLoaderLineIndex;

    // We want to remove everything from (autoloaderIndex+1) to modulesEndIndex inclusive and replace with "MODULE_SETUP"
    lines.splice(autoloaderIndex + 1, modulesEndIndex - (autoloaderIndex), 'MODULE_SETUP');

    // Update functionsFileContent after this modification
    functionsFileContent = lines.join('\n');
    
    // ---------------------------------------
    // STEP 3: Extract the load_dependancies lines
    // ---------------------------------------
    // We need everything between "private function load_dependancies(){" and the closing "}" of that function.
    // We'll look for a pattern: "private function load_dependancies()" line and then collect lines until we reach the first line with just "}"
    // or the line that closes the function.

    lines = functionsFileContent.split('\n');
    const loadDepStartIndex = lines.findIndex(line => line.includes('private function load_dependancies()'));
    
    // Find the matching closing brace for load_dependancies()
    // We'll count braces. Start at loadDepStartIndex, from the next line onward until braces balanced.
    let braceCount = 0;
    let loadDepEndIndex = -1;
    for (let i = loadDepStartIndex; i < lines.length; i++) {
        if (lines[i].includes('private function load_dependancies()')) {
            // function start
            // Increase braceCount once we find '{'
            const openBraceMatch = lines[i].match(/{/g);
            if (openBraceMatch) braceCount += openBraceMatch.length;
        } else {
            // Check for { and }
            const openBraceMatch = lines[i].match(/{/g);
            const closeBraceMatch = lines[i].match(/}/g);

            if (openBraceMatch) braceCount += openBraceMatch.length;
            if (closeBraceMatch) braceCount -= closeBraceMatch.length;
        }

        if (braceCount === 0 && i > loadDepStartIndex) {
            loadDepEndIndex = i;
            break;
        }
    }

    // Extract the lines inside load_dependancies (excluding the function signature and the last brace)
    const dependanciesLines = lines.slice(loadDepStartIndex + 1, loadDepEndIndex).map(l => l.trim()).filter(l => l && !l.startsWith('}'));

    // We only want the require_once lines. The instructions say "of each line between ... and ...",
    // so presumably every line inside is what we capture. Typically they are require_once lines.
    const projectDependancies = dependanciesLines;

    if (isFunctionsFile) {
        const match = projectDependancies[0].match(/\b[A-Z_]+\b/);

        if (match) {
            const DIR_VAR = match[0];

            const startString = "includes/";
            const startIndex = filePath.indexOf(startString);

            let relativePath = filePath;

            if (startIndex !== -1) {
                relativePath = filePath.substring(startIndex);
            }

            const newDependancy = `require_once ${DIR_VAR} . '${relativePath}';`;

            if (projectDependancies.includes(newDependancy)) {
                prompts.notification(`This dependancy has already been added to the Theme Functions file`);
                return;
            }

            projectDependancies.push(newDependancy);
        }
    }

    const paddedDependancies = projectDependancies.map(line => `            ${line}`);
    const dependancySetup = paddedDependancies.join('\n');

    // ---------------------------------------
    // STEP 4: Replace the lines in load_dependancies with "DEPENDANCIES"
    // ---------------------------------------
    // We'll replace everything between "private function load_dependancies(){" and the closing "}" with "DEPENDANCIES"
    // That means from loadDepStartIndex+1 to loadDepEndIndex-1 we replace all those lines with "DEPENDANCIES".
    
    // The function currently looks like:
    // private function load_dependancies(){
    //     require_once ...
    //     ...
    // }

    // After replacement:
    // private function load_dependancies(){
    // DEPENDANCIES
    // }

    const numberOfLinesToRemove = (loadDepEndIndex - 1) - (loadDepStartIndex + 1) + 1;
    lines.splice(loadDepStartIndex + 1, numberOfLinesToRemove, 'DEPENDANCIES');

    // Update functionsFileContent
    functionsFileContent = lines.join('\n');

    if (moduleSetup) {
        functionsFileContent = functionsFileContent.replace('MODULE_SETUP', moduleSetup);
    }

    if (dependancySetup) {
        functionsFileContent = functionsFileContent.replace('DEPENDANCIES', dependancySetup);
    }

    // -----------------------------------------------------------
    // Step 7: Write the Updated Content
    // -----------------------------------------------------------
    file.write(functionsFilePath, functionsFileContent);

    // -----------------------------------------------------------
    // Step 8: Notify Success
    // -----------------------------------------------------------
    prompts.fileUpdated(functionsFilePath, `Successfully added ${reference} to Theme Functions`);
}

module.exports = {
  addToParentModule,
  addToThemeFunctions
}