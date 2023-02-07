const vscode     = require('vscode');
const file       = require('./src/utils/file');
const syntax     = require('./src/utils/syntax');
const part       = require('./src/scaffolds/part');
const stories    = require('./src/scaffolds/stories');
const style      = require('./src/scaffolds/style');
const javascript = require('./src/scaffolds/javascript');
const block      = require('./src/scaffolds/block');
const templates  = require('./src/scaffolds/templates');

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

  let generateCarouselTemplate = vscode.commands.registerCommand('atomic-component-suite.generateCarouselTemplate', (folder) => {
    createTemplateFiles(folder, 'carousel');
  });

  let generateClickableTemplate = vscode.commands.registerCommand('atomic-component-suite.generateClickableTemplate', (folder) => {
    createTemplateFiles(folder, 'clickable');
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
  // ✅ Subscribe Commands
  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

  context.subscriptions.push(generateFiles, generatePartFile, generateStoriesFile, generateStyleFile, generateJavascriptFile, generateBlockFiles,generateCarouselTemplate,generateClickableTemplate,generateFeaturedTemplate,generateHeroTemplate,generatePluralTemplate,generateSectionTemplate);
}

module.exports = {
	activate
}
