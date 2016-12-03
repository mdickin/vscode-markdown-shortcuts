var vscode = require("vscode")
var editorHelpers = require("./editorHelpers");
var tables = require("./tables");

module.exports = {
    register: register
}

var _commands = [
    new Command('toggleStrikethrough', toggleStrikethrough, 'Toggle Strikethrough', '~~Strikethrough text~~', true),
    new Command('showCommandPalette', showCommandPalette),
    new Command('toggleBold', toggleBold, 'Toggle bold', '**Bold text**', true),
    new Command('toggleItalic', toggleItalic, 'Toggle italic', '_italic text_', true),
    new Command('toggleCodeBlock', toggleCodeBlock, 'Toggle code block', '```Code block```', true),
    new Command('toggleInlineCode', toggleInlineCode, 'Toggle inline code', '`Inline code`', true),
    new Command('toggleLink', toggleLink, 'Toggle hyperlink', '[Link text](link_url)', true),
    new Command('toggleBullets', toggleBullets, 'Toggle bullet points', '* Bullet point', true),
    new Command('toggleNumbers', toggleNumberList, 'Toggle number list', '1 Numbered list item', true),
    new Command('toggleTitleH1', toggleTitleH1, 'Toggle title H1', '# Title', true),
    new Command('toggleTitleH2', toggleTitleH2, 'Toggle title H2', '## Title', true),
    new Command('toggleTitleH3', toggleTitleH3, 'Toggle title H3', '### Title', true),
    new Command('toggleTitleH4', toggleTitleH4, 'Toggle title H4', '#### Title', true),
    new Command('toggleTitleH5', toggleTitleH5, 'Toggle title H5', '##### Title', true),
    new Command('toggleTitleH6', toggleTitleH6, 'Toggle title H6', '###### Title', true),
    new Command('toggleCheckboxes', toggleCheckboxes, 'Toggle checkboxes', '- [x] Checkbox item', true),
    new Command('addTable', tables.addTable, 'Add table', 'Tabular | values', true),
    new Command('addTableWithHeader', tables.addTableWithHeader, 'Add table (with header)', 'Tabular | values', true)
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
    editorHelpers.surroundSelection('**')
}

function toggleItalic() {
    editorHelpers.surroundSelection('_')
}

function toggleStrikethrough() {
    editorHelpers.surroundSelection('~~');
}

function toggleCodeBlock() {
    editorHelpers.surroundBlockSelection('```\n', '```')
}

function toggleInlineCode() {
    editorHelpers.surroundSelection('`')
}

function toggleTitleH1() {
    editorHelpers.surroundSelection('# ','')
}

function toggleTitleH2() {
    editorHelpers.surroundSelection('## ','')
}

function toggleTitleH3() {
    editorHelpers.surroundSelection('### ','')
}

function toggleTitleH4() {
    editorHelpers.surroundSelection('#### ','')
}

function toggleTitleH5() {
    editorHelpers.surroundSelection('##### ','')
}

function toggleTitleH6() {
    editorHelpers.surroundSelection('###### ','')
}

var HasBullets = /^(\s*)\* (.*)$/gm
var AddBullets = /^(\s*)(.+)$/gm
function toggleBullets() {
    
    if (!editorHelpers.isAnythingSelected()) {
        editorHelpers.surroundSelection("* ", "")
        return;
    }
    
    if (editorHelpers.isMatch(HasBullets)) {
        editorHelpers.replaceBlockSelection((text) => text.replace(HasBullets, "$1$2"))
    }
    else {
        editorHelpers.replaceBlockSelection((text) => text.replace(AddBullets, "$1* $2"))
    }
}

var HasNumbers = /^(\s*)[0-9]\.+ (.*)$/gm
var AddNumbers = /^(\n?)(\s*)(.+)$/gm
function toggleNumberList() {
    
    if (!editorHelpers.isAnythingSelected()) {
        editorHelpers.surroundSelection("1. ", "")
        return;
    }
    
    if (editorHelpers.isMatch(HasNumbers)) {
        editorHelpers.replaceBlockSelection((text) => text.replace(HasNumbers, "$1$2"))
    }
    else {
       var lineNums = {};
        editorHelpers.replaceBlockSelection((text) => text.replace(AddNumbers, (match, newline, whitespace, line) => {
            if (!lineNums[whitespace]) {
                lineNums[whitespace] = 1
            }
            return newline + whitespace + lineNums[whitespace]++ + ". " + line
        }))
    }
}

var HasCheckboxes = /^(\s*)- \[[ x]{1}\] (.*)$/gm
var AddCheckboxes = /^(\s*)(.+)$/gm
function toggleCheckboxes() {
    
    if (!editorHelpers.isAnythingSelected()) {
        editorHelpers.surroundSelection("- [ ]", "")
        return;
    }
    
    if (editorHelpers.isMatch(HasCheckboxes)) {
        editorHelpers.replaceBlockSelection((text) => text.replace(HasCheckboxes, "$1$2"))
    }
    else {
        editorHelpers.replaceBlockSelection((text) => text.replace(AddCheckboxes, "$1- [ ] $2"))
    }
}

function toggleLink() {
    
    if (editorHelpers.isMatch(/^\[.+\]\(.+\)$/i)) {
        editorHelpers.replaceSelection((text) => text.match(/\[(.+)\]/)[1])
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
        
        editorHelpers.surroundSelection("[" + options.text, "](" + options.url + ")")
    }
}

function Command(command, callback, label, description, showInCommandPalette) {
    this.command = command;
    this.callback = callback;
    this.label = label;
    this.description = description;
    this.showInCommandPalette = showInCommandPalette ? showInCommandPalette : false;
}