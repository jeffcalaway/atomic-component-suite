const registerIncludesMenu = require('./menus/includesMenu');
const registerTemplatePartsMenu = require('./menus/templatePartsMenu');

function activate(context) {
  registerIncludesMenu(context);
  registerTemplatePartsMenu(context);
}

module.exports = {
    activate
};
