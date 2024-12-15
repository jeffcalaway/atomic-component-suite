const registerIncludesMenu = require('./src/menus/includesMenu');
const registerTemplatePartsMenu = require('./src/menus/templatePartsMenu');

function activate(context) {
  registerIncludesMenu(context);
  registerTemplatePartsMenu(context);
}

module.exports = {
    activate
};
