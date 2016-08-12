var vscode = require("vscode")
module.exports = {
    register: register
}

var _commands = [
    new Command('showCommandPalette', showCommandPalette),
    new Command('toggleBold', toggleBold, 'Toggle bold', '**Bold text**', true),
    new Command('toggleItalic', toggleItalic, 'Toggle italic', '_italic text_', true),
    new Command('toggleCodeBlock', toggleCodeBlock, 'Toggle code block', '```Code block```', true),
    new Command('toggleInlineCode', toggleInlineCode, 'Toggle inline code', '`Inline code`', true),
    new Command('toggleLink', toggleLink, 'Toggle hyperlink', '[Link text](link_url)', true),
    new Command('toggleBullets', toggleBullets, 'Toggle bullet points', '* Bullet point', true),
    new Command('toggleNumbers', toggleNumberList, 'Toggle number list', '1 Numbered list item', true),
    new Command('toggleTitleH2', toggleTitleH2, 'Toggle title H2', '## Title', true),
    new Command('toggleTitleH3', toggleTitleH3, 'Toggle title H3', '### Title', true),
    new Command('toggleTitleH4', toggleTitleH4, 'Toggle title H4', '#### Title', true),
    new Command('toggleTitleH5', toggleTitleH5, 'Toggle title H5', '##### Title', true),
    new Command('toggleTitleH6', toggleTitleH6, 'Toggle title H6', '###### Title', true),
]

function register(context) {
    
    _commands.map((cmd) => {
        context.subscriptions.push(vscode.commands.registerCommand('md-shortcut.' + cmd.command, cmd.callback))
    })
}

function showCommandPalette() {
    vscode.window.showQuickPick(_commands.filter((cmd) => cmd.showInCommandPalette), {
        matchOnDescription: true
    })
        .then((cmd) => {
            if (!cmd) return;
            
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

function toggleTitleH2() {
    surroundSelection('## ','')
}

function toggleTitleH3() {
    surroundSelection('### ','')
}

function toggleTitleH4() {
    surroundSelection('#### ','')
}

function toggleTitleH5() {
    surroundSelection('##### ','')
}

function toggleTitleH6() {
    surroundSelection('###### ','')
}

var HasBullets = /^(\s*)\* (.*)$/gm
var AddBullets = /^(\s*)(.+)$/gm
function toggleBullets() {
    
    if (!isAnythingSelected()) {
        surroundSelection("* ", "")
        return;
    }
    
    if (isMatch(HasBullets)) {
        replaceSelection((text) => text.replace(HasBullets, "$1$2"))
    }
    else {
        replaceSelection((text) => text.replace(AddBullets, "$1* $2"))
    }
}

var HasNumbers = /^(\s*)[0-9]\.+ (.*)$/gm
var AddNumbers = /^(\s*)(.+)$/gm
function toggleNumberList() {
    
    if (!isAnythingSelected()) {
        surroundSelection("1. ", "")
        return;
    }
    
    if (isMatch(HasNumbers)) {
        replaceSelection((text) => text.replace(HasNumbers, "$1$2"))
    }
    else {
       var lineNums = {};
        replaceSelection((text) => text.replace(AddNumbers, (match, whitespace, line) => {
            if (!lineNums[whitespace]) {
                lineNums[whitespace] = 1
            }
            return whitespace + lineNums[whitespace]++ + ". " + line
        }))
    }
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

function isAnythingSelected() {
    return !vscode.window.activeTextEditor.selection.isEmpty;
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