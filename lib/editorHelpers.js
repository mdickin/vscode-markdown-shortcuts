var vscode = require("vscode");

module.exports = {
    isAnythingSelected: isAnythingSelected,
    replaceSelection: replaceSelection,
    surroundSelection: surroundSelection,
    isMatch: isMatch
}

function replaceSelection(replaceFunc) {
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    
    var newText = replaceFunc(editor.document.getText(selection));
    return editor.edit((edit) => {
        edit.replace(selection, newText)
    })
}

function isAnythingSelected() {
    return !vscode.window.activeTextEditor.selection.isEmpty;
}

function surroundSelection(startPattern, endPattern)
{
    if (endPattern == undefined || endPattern == null) endPattern = startPattern;
    
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    
    if (!isAnythingSelected()) {
        var position = selection.active;
        var newPosition = position.with(position.line, position.character + startPattern.length)
        editor.edit((edit) => {
            edit.insert(selection.start, startPattern + endPattern);
        }).then(() => {
            editor.selection = new vscode.Selection(newPosition, newPosition)
        })
    }
    else {
        if (isMatch(startPattern, endPattern)) {
            replaceSelection((text) => text.substr(startPattern.length, text.length - startPattern.length - endPattern.length))
        }
        else {
            replaceSelection((text) => startPattern + text + endPattern)
        }
    }
}

function isMatch(startPattern, endPattern) {
    
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    
    var text = editor.document.getText(selection)
    if (startPattern.constructor === RegExp) {
        return startPattern.test(text);
    }
    
    return text.startsWith(startPattern) && text.endsWith(endPattern)
}