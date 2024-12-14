const vscode = require('vscode');
const boilerplate = require('../../../../scaffolds/wordpress/component/boilerplate');

module.exports = Object.keys(boilerplate).map((boilerplateName) => 
    vscode.commands.registerCommand(
        `atomic-component-suite.generate${boilerplateName.charAt(0).toUpperCase() + boilerplateName.slice(1)}Boilerplate`,
        (folder) => boilerplate[boilerplateName].generate(folder)
    )
);
