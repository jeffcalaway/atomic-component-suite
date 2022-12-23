const vscode = require('vscode');
const fs     = require('fs');

const open = function (filePath) {
  vscode.workspace.openTextDocument(filePath).then(document => {
    vscode.window.showTextDocument(document);
  });
}

const create = function ( filePath, content, openAfterCreate = false ) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath,content);

    if (openAfterCreate) {
      open(filePath);
    }
  }
}

module.exports = {
  create,
  open
}