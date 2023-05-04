const templateBlocks    = require('./classes/template-blocks');
const templateData      = require('./classes/template-data');
const parentModule      = require('./classes/parent-module');
const parentModuleEmpty = require('./classes/parent-module-empty');
const postInterface     = require('./classes/interface');
const functions         = require('./classes/functions');
const setup             = require('./classes/setup');
const hooks             = require('./classes/hooks');

module.exports = {
  setup,
  postInterface,
  functions,
  templateBlocks,
  templateData,
  parentModule,
  parentModuleEmpty,
  hooks,
}