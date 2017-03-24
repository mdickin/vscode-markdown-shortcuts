var vscode = require("vscode");

module.exports = {
    isAnythingSelected: isAnythingSelected,
    replaceSelection: replaceSelection,
    replaceBlockSelection: replaceBlockSelection,
    surroundSelection: surroundSelection,
    surroundBlockSelection: surroundBlockSelection,
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

function replaceBlockSelection(replaceFunc) {
    var editor = vscode.window.activeTextEditor;
    var selection = getBlockSelection();
    
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
        return editor.edit((edit) => {
                edit.insert(selection.start, startPattern + endPattern);
            }).then(() => {
                editor.selection = new vscode.Selection(newPosition, newPosition)
            })
    }
    else {
        if (isSelectionMatch(selection, startPattern, endPattern)) {
            return replaceSelection((text) => text.substr(startPattern.length, text.length - startPattern.length - endPattern.length))
        }
        else {
            return replaceSelection((text) => startPattern + text + endPattern)
        }
    }
}

function surroundBlockSelection(startPattern, endPattern)
{
    if (endPattern == undefined || endPattern == null) endPattern = startPattern;
    
    var editor = vscode.window.activeTextEditor;
    var selection = getBlockSelection();
    
    if (!isAnythingSelected()) {
        var position = selection.active;
        var newPosition = position.with(position.line + 1, 0)
        return editor.edit((edit) => {
                edit.insert(selection.start, startPattern + endPattern);
            }).then(() => {
                editor.selection = new vscode.Selection(newPosition, newPosition)
            })
    }
    else {
        if (isSelectionMatch(selection, startPattern, endPattern)) {
            return replaceBlockSelection((text) => text.substr(startPattern.length, text.length - startPattern.length - endPattern.length))
        }
        else {
            return replaceBlockSelection((text) => startPattern + text + endPattern)
        }
    }
}

function getBlockSelection() {
    var selection = vscode.window.activeTextEditor.selection;

    if ( selection.isEmpty ) {
        return selection;
    }

    return selection
        .with(selection.start.with(undefined, 0),
              selection.end.with(selection.end.line + 1, 0));
}

function isMatch(startPattern, endPattern) {    
    return isSelectionMatch(vscode.window.activeTextEditor.selection, startPattern, endPattern);
}

function isSelectionMatch(selection, startPattern, endPattern) {    
    var editor = vscode.window.activeTextEditor;
    var text = editor.document.getText(selection)
    if (startPattern.constructor === RegExp) {
        return startPattern.test(text);
    }
    
    return text.startsWith(startPattern) && text.endsWith(endPattern)
}