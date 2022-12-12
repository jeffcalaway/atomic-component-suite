// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path   = require('path');
const fs     = require('fs');

// this method is called when your extension is activated
function activate(context) {

  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Open File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const openFile = (filePath) => {
    vscode.workspace.openTextDocument(filePath).then(document => {
      vscode.window.showTextDocument(document);
    });
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Component Info
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const getComponentInfo = (folder) => {
    const folderPath              = folder.fsPath;
    const folderName              = path.basename(folderPath);
    const parentFolderName        = path.basename(path.dirname(folderPath));
    const parentFolderFirstLetter = parentFolderName.charAt(0);

    const folderNameCapitalizedWithSpaces      = folderName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    const folderNameCapitalizedWithUnderscores = folderNameCapitalizedWithSpaces.replace(/ /g, "_");
    const folderNameCapitalizedAndCamel        = folderNameCapitalizedWithSpaces.split(" ").join("");

    const folderNameLowercaseWithSpaces      = folderName.replace(/-/g, " ").replace(/\b\w/g, l => l);
    const folderNameLowercaseWithUnderscores = folderNameLowercaseWithSpaces.replace(/ /g, "_");

    const parentFolderNameCapitalized          = parentFolderName.replace(/\b\w/g, l => l.toUpperCase());

    return {
      folder: {
        path: folderPath,
        name: {
          base: folderName,
          capital: {
            spaces: folderNameCapitalizedWithSpaces,
            underscores: folderNameCapitalizedWithUnderscores,
            camel: folderNameCapitalizedAndCamel
          },
          lowercase: {
            spaces: folderNameLowercaseWithSpaces,
            underscores: folderNameLowercaseWithUnderscores
          }
        }
      },
      group: {
        name: {
          base: parentFolderName,
          capital: parentFolderNameCapitalized
        },
        letter: parentFolderFirstLetter
      }
    }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Base File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentBaseFile = (folder) => {
    const component   = getComponentInfo(folder);
    const folderName  = component.folder.name.base;
    const groupLetter = component.group.letter;

    const filePath  = path.join(component.folder.path, `${folderName}.php`);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `<?php
      $props->admit_props([
          'KEY_NAME'
      ]);
  
      extract($props->to_array());
  
      $class = $props->class([
          '${groupLetter}-${folderName}'
      ]);
  ?>`);
      }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Stories File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentStoriesFile = (folder) => {
    const component       = getComponentInfo(folder);
    const folderName      = component.folder.name.base;
    const folderClassName = component.folder.name.capital.underscores;
    const folderTitle     = component.folder.name.capital.spaces;
    const groupName       = component.group.name.base;
    const groupTitle      = component.group.name.capital;

    const filePath = path.join(component.folder.path, `${folderName}.stories.php`);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `<?php
  
  use Useful_Stories\\Library\\Stories;
  
  class ${folderClassName} extends Stories {
      function __construct(){
          $this->title = '${groupTitle}/${folderTitle}';
          $this->defaults = [
              
          ];
      }
  
      function template($args=[]) {
          $args = wp_parse_args($args, $this->defaults);
  
          render_template_part('${groupName}/${folderName}', $args);
      }
  
      function initialize() {
          $default = $this->add_story('Default', [$this, 'template']);
      }
  }`);
    }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Style File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentStyleFile = (folder) => {
    const component       = getComponentInfo(folder);
    const folderName      = component.folder.name.base;
    const groupLetter     = component.group.letter;

    const FilePath = path.join(component.folder.path, `${folderName}.scss`);
    if (!fs.existsSync(FilePath)) {
    fs.writeFileSync(FilePath, `.${groupLetter}-${folderName} {
    
}`);
    }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Javascript File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentJavascriptFile = (folder) => {
    const component            = getComponentInfo(folder);
    const folderName           = component.folder.name.base;
    const folderNameCamel      = component.folder.name.capital.camel;
    const folderNameLowerUnderscore = component.folder.name.lowercase.underscores;
    const groupLetter          = component.group.letter;

    const FilePath = path.join(component.folder.path, `${folderName}.js`);
    if (!fs.existsSync(FilePath)) {
    fs.writeFileSync(FilePath, `jQuery($ => {
      class ${folderNameCamel} {
        constructor(element) {
          this._        = element;
          this._element = $(element);
    
          this.init();
        }
    
        //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
        // ✅ Initialize
        //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    
        init() {
          this.setupHandlers();
          this._element.trigger( 'init', this );
        }
    
        //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
        // ✅ Setup Handlers
        //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    
        setupHandlers() {
          
        }
      }
    
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
      // ✅ Setup jQuery Plugin
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    
      $.fn.${folderNameLowerUnderscore} = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
          if (typeof opt == 'object' || typeof opt == 'undefined')
            _[i].${folderNameLowerUnderscore} = new ${folderNameCamel}(_[i], opt);
          else
            ret = _[i].${folderNameLowerUnderscore}[opt].apply(_[i].${folderNameLowerUnderscore}, args);
          if (typeof ret != 'undefined') return ret;
        }
        return _;
      }
    
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
      // ✅ Run
      //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    
      $('.${groupLetter}-${folderName}').${folderNameLowerUnderscore}();
  });`);
    }
  }

  
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateFiles = vscode.commands.registerCommand('atomic-component-suite.generateComponentFiles', (folder) => {
    const component  = getComponentInfo(folder);
    const folderPath = component.folder.path;
    const folderName = component.folder.name.base;
    
    createComponentBaseFile(folder);
    const phpFilePath = path.join(folderPath, `${folderName}.php`);

    // Create PHP file with the name of the folder and the ".stories" extension
    createComponentStoriesFile(folder);

    // Create SCSS file with the same name as the folder
    createComponentStyleFile(folder);

    // Open php file
    openFile(phpFilePath);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Base File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateBaseFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentBaseFile', (folder) => {
    const component  = getComponentInfo(folder);
    const folderPath = component.folder.path;
    const folderName = component.folder.name.base;
    
    createComponentBaseFile(folder);
    const filePath = path.join(folderPath, `${folderName}.php`);

    // Open php file
    openFile(filePath);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Stories File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateStoriesFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentStoriesFile', (folder) => {
    const component  = getComponentInfo(folder);
    const folderPath = component.folder.path;
    const folderName = component.folder.name.base;
    
    createComponentStoriesFile(folder);
    const filePath = path.join(folderPath, `${folderName}.stories.php`);

    // Open php file
    openFile(filePath);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Style File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateStyleFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentStyleFile', (folder) => {
    const component  = getComponentInfo(folder);
    const folderPath = component.folder.path;
    const folderName = component.folder.name.base;
    
    createComponentStyleFile(folder);
    const filePath = path.join(folderPath, `${folderName}.scss`);

    // Open php file
    openFile(filePath);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Javascript File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateJavascriptFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentJavascriptFile', (folder) => {
    const component  = getComponentInfo(folder);
    const folderPath = component.folder.path;
    const folderName = component.folder.name.base;
    
    createComponentJavascriptFile(folder);
    const filePath = path.join(folderPath, `${folderName}.js`);

    // Open php file
    openFile(filePath);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Subscribe Commands
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  context.subscriptions.push(generateFiles, generateBaseFile, generateStoriesFile, generateStyleFile, generateJavascriptFile);
}

module.exports = {
	activate
}
