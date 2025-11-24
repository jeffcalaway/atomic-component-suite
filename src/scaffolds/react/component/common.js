const processDirectory = require('../../../utils/processDirectory');
const path = require('path');
const folderName = path.basename(__filename, '.js');

module.exports = processDirectory(path.join(__dirname, folderName));