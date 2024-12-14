const commonWordpressCommands = require('./wordpress/component/generateCommon');
const boilerplateCommands     = require('./wordpress/component/generateBoilerplate');
const reactComponentCommands  = require('./react/component/generateCommon');

module.exports = (context) => {
    context.subscriptions.push(
        ...commonWordpressCommands,
        ...boilerplateCommands,
        ...reactComponentCommands
    );
};