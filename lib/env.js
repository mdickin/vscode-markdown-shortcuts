const os = require('os');
const vscode = require('vscode');

function getEol() {
    const newLineSetting = vscode.workspace.getConfiguration('files', null).get('eol');
    let newLine = os.EOL;
    if (newLineSetting === '\n' || newLineSetting === '\r\n') newLine = newLineSetting;

    return newLine;
}

module.exports = {
    getEol: getEol
}