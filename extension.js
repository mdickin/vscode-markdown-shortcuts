var commands = require('./lib/commands');

function activate(context) {

    commands.register(context)
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;