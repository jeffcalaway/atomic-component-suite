const file = require('./file');
const syntax = require('./syntax');
const format = require('./format');
const prompts = require('./prompts');

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
        const parentName = parentFileName.replace('class-', '').replace('.php', ''); 
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
        const rawChildName = childFileName.replace('class-', '').replace('.php', ''); // e.g. "Hubspot"
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
  
          add_modules([
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

module.exports = {
  addToParentModule
}