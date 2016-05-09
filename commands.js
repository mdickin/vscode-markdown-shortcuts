var vscode = require("vscode")
module.exports = {
    register: register
}

var _commands = [
    new Command('md-shortcut.showCommandPalette', showCommandPalette),
    new Command('md-shortcut.toggleBold', toggleBold, 'Toggle bold', '**Bold text**', true),
    new Command('md-shortcut.toggleItalic', toggleItalic, 'Toggle italic', '_italic text_', true),
    new Command('md-shortcut.toggleCodeBlock', toggleCodeBlock, 'Toggle code block', '```Code block```', true),
    new Command('md-shortcut.toggleInlineCode', toggleInlineCode, 'Toggle inline code', '`Inline code`', true),
    new Command('md-shortcut.toggleLink', toggleLink, 'Toggle hyperlink', '[Link text](link_url)', true)
]

function register(context) {
    
    _commands.map((cmd) => {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.command, cmd.callback))
    })
}

function showCommandPalette() {
    vscode.window.showQuickPick(_commands.filter((cmd) => cmd.showInCommandPalette), {
        matchOnDescription: true
    })
        .then((cmd) => {
            cmd.callback();
        })
}

function toggleBold() {
    surroundSelection('**')
}

function toggleItalic() {
    surroundSelection('_')
}

function toggleCodeBlock() {
    surroundSelection('```\n', '\n```')
}

function toggleInlineCode() {
    surroundSelection('`')
}

function toggleLink() {
    
    if (isMatch(/^\[.+\]\(.+\)$/i)) {
        replaceSelection((text) => text.match(/\[(.+)\]/)[1])
        return;
    }
    else {
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;
        
        return getLinkText()
            .then(getLinkUrl)
            .then(addTags);
    }
    
    function getLinkText() {
        if (selection.isEmpty) {
            return vscode.window.showInputBox({
                prompt: "Link text"
            })
        }
        
        return Promise.resolve("")
    }
    
    function getLinkUrl(linkText) {
        if (linkText == null || linkText == undefined) return;
        
        return vscode.window.showInputBox({
                prompt: "Link URL"
            })
            .then((url) => {
                return { text: linkText, url: url}
            })
    }
    
    function addTags(options) {
        if (!options || !options.url) return;
        
        surroundSelection("[" + options.text, "](" + options.url + ")")
    }
}

function surroundSelection(startPattern, endPattern)
{
    if (!endPattern) endPattern = startPattern;
    
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    
    if (selection.isEmpty) {
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

function replaceSelection(replaceFunc) {
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    
    var newText = replaceFunc(editor.document.getText(selection));
    editor.edit((edit) => {
        edit.replace(selection, newText)
    })
}

function Command(command, callback, label, description, showInCommandPalette) {
    this.command = command;
    this.callback = callback;
    this.label = label;
    this.description = description;
    this.showInCommandPalette = showInCommandPalette ? showInCommandPalette : false;
}