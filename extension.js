var vscode = require('vscode');
var commands = require('./lib/commands');

function activate(context) {
    function buildLanguageRegex() {
        const languageArray = vscode.workspace
            .getConfiguration('markdownShortcuts')
            .get('languages');
        return new RegExp('(' + languageArray.join('|') + ')');
    }

    function toggleMarkdownShortcuts(langId) {
        vscode.commands.executeCommand(
            'setContext',
            'markdownShortcuts:enabled',
            languageRegex.test(langId)
        );
    }

    // Execute on activate
    let languageRegex = buildLanguageRegex();
    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        toggleMarkdownShortcuts(activeEditor.document.languageId);
    }

    // Update languageRegex if the configuration changes
    vscode.workspace.onDidChangeConfiguration(
        configChange => {
            if (
                configChange.affectsConfiguration('markdownShortcuts.languages')
            ) {
                languageRegex = buildLanguageRegex();
            }
        },
        null,
        context.subscriptions
    );

    // Enable/disable markdownShortcuts
    vscode.window.onDidChangeActiveTextEditor(
        editor => {
            activeEditor = editor;
            if (activeEditor) {
                toggleMarkdownShortcuts(activeEditor.document.languageId);
            }
        },
        null,
        context.subscriptions
    );

    // Triggered with language id change
    vscode.workspace.onDidOpenTextDocument(
        document => {
            if (activeEditor.document === document) {
                toggleMarkdownShortcuts(activeEditor.document.languageId);
            }
        },
        null,
        context.subscriptions
    );

    commands.register(context);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
