const vscode     = require('vscode');
const file       = require('./src/utils/file');
const syntax     = require('./src/utils/syntax');
const format     = require('./src/utils/format');
const part       = require('./src/scaffolds/part');
const stories    = require('./src/scaffolds/stories');
const style      = require('./src/scaffolds/style');
const javascript = require('./src/scaffolds/javascript');
const block      = require('./src/scaffolds/block');
const templates  = require('./src/scaffolds/templates');
const classes    = require('./src/scaffolds/classes');
const postType   = require('./src/scaffolds/postType');
const taxonomy   = require('./src/scaffolds/taxonomy');
const fs         = require('fs');

function activate(context) {
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Part File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentPartFile = ( folder, open = false ) => {
    const filePath = syntax.getFile(folder, '.php');
    const template = part.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Stories File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentStoriesFile = ( folder, open = false ) => {
    const filePath = syntax.getFile(folder, '.stories.php');
    const template = stories.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Style File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentStyleFile = ( folder, open = false ) => {
    const filePath = syntax.getFile(folder, '.scss');
    const template = style.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Javascript File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentJavascriptFile = ( folder, open = false ) => {
    const filePath = syntax.getFile(folder, '.js');
    const template = javascript.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Block PHP File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentBlockPhpFile = ( folder, open = false ) => {
    const phpFilePath = syntax.getFile(folder, '.block.php');
    const phpTemplate = block.phpTemplate(folder);
    
    file.create(phpFilePath, phpTemplate, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Block JSON File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createComponentBlockJsonFile = ( folder, open = false ) => {
    const jsonFilePath = syntax.getFile(folder, '.block.json');
    const jsonTemplate = block.jsonTemplate(folder);
    
    file.create(jsonFilePath, jsonTemplate, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Template Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTemplateFiles = (folder, templateName) => {
    if (!templates.hasOwnProperty(templateName)) return;

    const template = templates[templateName];

    let files = {
      '.php'        : 'part',
      '.js'         : 'javascript',
      '.scss'       : 'style',
      '.stories.php': 'stories'
    }

    const filtered = Object.entries(files)
    .filter(([key, value]) => (template.hasOwnProperty(value) && template[value]))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

    const firstExt = Object.keys(filtered)[0];

    for (let ext in filtered) {
      const method = files[ext];
      
      const filePath = syntax.getFile(folder, ext);
      file.create(filePath, template[method](folder), ext === firstExt);
    }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Module File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createModuleFile = ( folder, open = false ) => {
    const pluralName = syntax.getName(folder);
    const dirPath    = syntax.getDirPath(folder);
    const filePath   = `${dirPath}/class-${pluralName}.php`;
    const template   = classes.parentModule.template(folder);


    if (!fs.existsSync(filePath)) {
      file.create(filePath, template, open);
    }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Template Blocks File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTemplateBlocksFile = ( folder, open = false ) => {
    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/class-template-blocks.php`;
    const template   = classes.templateBlocks.template(folder);
    
    file.create(filePath, template, open);
  }

  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Template Data File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTemplateDataFile = ( folder, open = false ) => {
    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/class-template-data.php`;
    const template   = classes.templateData.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create PostType Functions File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createPostTypeFunctionsFile = ( folder, open = false ) => {
    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/functions.php`;
    const template   = postType.functions.template(folder);
    
    file.create(filePath, template, open);
  }

  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create PostType Interface File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createPostTypeInterfaceFile = ( folder, open = false ) => {
    const folderName = syntax.getName(folder);
    const singleName = format.toSingular(folderName);

    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/class-${singleName}.php`;
    const template   = postType.postInterface.template(folder);
    
    file.create(filePath, template, open);
  }

  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create PostType Setup File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createPostTypeSetupFile = ( folder, open = false ) => {
    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/class-setup.php`;
    const template   = postType.setup.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Post Type Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createPostTypeFiles = (folder, templateName) => {
    const folderName = syntax.getName(folder);
    const singleName = format.toSingular(folderName);

    const template = postType[templateName];

    let files = {
      'functions'     : 'functions.php',
      'postInterface' : `class-${singleName}.php`,
      'templateBlocks': 'template-blocks.php',
      'templateData'  : 'template-data.php',
      'setup'         : 'class-setup.php'
    }

    for (let method in files) {
      const folder = syntax.getPath(folder);
      const file   = files[method];

      const filePath = `${folder}/${file}`;
      file.create(filePath, template[method](folder), method === 'setup');
    }
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Taxonomy Functions File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTaxonomyFunctionsFile = ( folder, open = false ) => {
    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/functions.php`;
    const template   = taxonomy.functions.template(folder);
    
    file.create(filePath, template, open);
  }

  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Taxonomy Interface File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTaxonomyInterfaceFile = ( folder, open = false ) => {
    const folderName = syntax.getName(folder);
    const singleName = format.toSingular(folderName);

    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/class-${singleName}.php`;
    const template   = taxonomy.taxInterface.template(folder);
    
    file.create(filePath, template, open);
  }

  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Taxonomy Setup File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTaxonomySetupFile = ( folder, open = false ) => {
    const folderPath = syntax.getPath(folder);
    const filePath   = `${folderPath}/class-setup.php`;
    const template   = taxonomy.setup.template(folder);
    
    file.create(filePath, template, open);
  }


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Create Taxonomy Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  const createTaxonomyFiles = (folder, templateName) => {
    const folderName = syntax.getName(folder);
    const singleName = format.toSingular(folderName);

    const template = taxonomy[templateName];

    let files = {
      'functions'     : 'functions.php',
      'postInterface' : `class-${singleName}.php`,
      'templateBlocks': 'template-blocks.php',
      'templateData'  : 'template-data.php',
      'setup'         : 'class-setup.php'
    }

    for (let method in files) {
      const folder = syntax.getPath(folder);
      const file   = files[method];

      const filePath = `${folder}/${file}`;
      file.create(filePath, template[method](folder), method === 'setup');
    }
  }

  
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateFiles = vscode.commands.registerCommand('atomic-component-suite.generateComponentFiles', (folder) => {
    createComponentStoriesFile(folder);
    createComponentStyleFile(folder);
    createComponentPartFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Part File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generatePartFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentPartFile', (folder) => {
    createComponentPartFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Stories File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateStoriesFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentStoriesFile', (folder) => {
    createComponentStoriesFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Style File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateStyleFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentStyleFile', (folder) => {
    createComponentStyleFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Javascript File
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateJavascriptFile = vscode.commands.registerCommand('atomic-component-suite.generateComponentJavascriptFile', (folder) => {
    createComponentJavascriptFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Component Block Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateBlockFiles = vscode.commands.registerCommand('atomic-component-suite.generateComponentBlockFiles', (folder) => {
    createComponentBlockPhpFile(folder, true);
    createComponentBlockJsonFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Template
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateSliderTemplate = vscode.commands.registerCommand('atomic-component-suite.generateSliderTemplate', (folder) => {
    createTemplateFiles(folder, 'slider');
  });

  let generateButtonTemplate = vscode.commands.registerCommand('atomic-component-suite.generateButtonTemplate', (folder) => {
    createTemplateFiles(folder, 'button');
  });

  let generateFeaturedTemplate = vscode.commands.registerCommand('atomic-component-suite.generateFeaturedTemplate', (folder) => {
    createTemplateFiles(folder, 'featured');
  });

  let generateHeroTemplate = vscode.commands.registerCommand('atomic-component-suite.generateHeroTemplate', (folder) => {
    createTemplateFiles(folder, 'hero');
  });

  let generatePluralTemplate = vscode.commands.registerCommand('atomic-component-suite.generatePluralTemplate', (folder) => {
    createTemplateFiles(folder, 'plural');
  });

  let generateSectionTemplate = vscode.commands.registerCommand('atomic-component-suite.generateSectionTemplate', (folder) => {
    createTemplateFiles(folder, 'section');
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Class Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateModuleFile = vscode.commands.registerCommand('atomic-component-suite.generateModuleFile', (folder) => {
    createModuleFile(folder, true);
  });

  let generateTemplateBlocksFile = vscode.commands.registerCommand('atomic-component-suite.generateTemplateBlocksFile', (folder) => {
    createTemplateBlocksFile(folder, true);
  });

  let generateTemplateDataFile = vscode.commands.registerCommand('atomic-component-suite.generateTemplateDataFile', (folder) => {
    createTemplateDataFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Post Type Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generatePostTypeFiles = vscode.commands.registerCommand('atomic-component-suite.generatePostTypeFiles', (folder) => {
    createModuleFile(folder);
    createPostTypeFunctionsFile(folder);
    createPostTypeInterfaceFile(folder);
    createTemplateBlocksFile(folder);
    createTemplateDataFile(folder);
    createPostTypeSetupFile(folder, true);
  });

  let generatePostTypeFunctionsFile = vscode.commands.registerCommand('atomic-component-suite.generatePostTypeFunctionsFile', (folder) => {
    createPostTypeFunctionsFile(folder, true);
  });

  let generatePostTypeInterfaceFile = vscode.commands.registerCommand('atomic-component-suite.generatePostTypeInterfaceFile', (folder) => {
    createPostTypeInterfaceFile(folder, true);
  });

  let generatePostTypeSetupFile = vscode.commands.registerCommand('atomic-component-suite.generatePostTypeSetupFile', (folder) => {
    createPostTypeSetupFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Generate Taxonomy Files
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  let generateTaxonomyFiles = vscode.commands.registerCommand('atomic-component-suite.generateTaxonomyFiles', (folder) => {
    createModuleFile(folder);
    createTaxonomyFunctionsFile(folder);
    createTaxonomyInterfaceFile(folder);
    createTemplateBlocksFile(folder);
    createTemplateDataFile(folder);
    createTaxonomySetupFile(folder, true);
  });

  let generateTaxonomyFunctionsFile = vscode.commands.registerCommand('atomic-component-suite.generateTaxonomyFunctionsFile', (folder) => {
    createTaxonomyFunctionsFile(folder, true);
  });

  let generateTaxonomyInterfaceFile = vscode.commands.registerCommand('atomic-component-suite.generateTaxonomyInterfaceFile', (folder) => {
    createTaxonomyInterfaceFile(folder, true);
  });

  let generateTaxonomySetupFile = vscode.commands.registerCommand('atomic-component-suite.generateTaxonomySetupFile', (folder) => {
    createTaxonomySetupFile(folder, true);
  });


  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ✅ Subscribe Commands
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  context.subscriptions.push(generateFiles, generatePartFile, generateStoriesFile, generateStyleFile, generateJavascriptFile, generateBlockFiles,generateSliderTemplate,generateButtonTemplate,generateFeaturedTemplate,generateHeroTemplate,generatePluralTemplate,generateSectionTemplate, generatePostTypeFunctionsFile,generatePostTypeInterfaceFile,generateTemplateBlocksFile,generateTemplateDataFile,generatePostTypeSetupFile,generatePostTypeFiles,generateTaxonomyFunctionsFile,generateTaxonomyInterfaceFile,generateTaxonomySetupFile,generateTaxonomyFiles, generateModuleFile);
}

module.exports = {
	activate
}
