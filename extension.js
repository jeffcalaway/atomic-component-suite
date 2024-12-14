const vscode = require('vscode');
const registerCommands = require('./commands/registerCommands');

function activate(context) {
    registerCommands(context);
}

module.exports = {
    activate
};
