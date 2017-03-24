/* global suite, test */

var assert = require( 'assert' );
var vscode = require( 'vscode' );
var vscodeTestContent = require( 'vscode-test-content' );

suite( "Bold", function() {
    test( "Ranged selection", function() {
        return TestCommand( 'toggleBold', 'Lets make a [bold} text!', 'Lets make a [**bold**} text!' );
    } );

    test( "Collapsed selection", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleBold', 'Lets make a bo^ld text!', 'Lets make a bo**^**ld text!' );
    } );

    test( "Toggles with ranged selection", function() {
        return TestCommand( 'toggleBold', 'Time to [**unbold**} this statement', 'Time to [unbold} this statement' );
    } );
} );

suite( "Italic", function() {
    test( "Ranged selection", function() {
        return TestCommand( 'toggleItalic', 'Lets make a [fancy} text!', 'Lets make a [_fancy_} text!' );
    } );

    test( "Collapsed selection", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleItalic', 'Lets make a fan^cy text!', 'Lets make a fan_^_cy text!' );
    } );

    test( "Toggles with ranged selection", function() {
        return TestCommand( 'toggleItalic', 'Lets make less [_fancy_} text', 'Lets make less [fancy} text' );
    } );
} );

suite( "Strike through", function() {
    test( "Ranged selection", function() {
        return TestCommand( 'toggleStrikethrough', 'Lets make a [fancy} text!', 'Lets make a [~~fancy~~} text!' );
    } );

    test( "Collapsed selection", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleStrikethrough', 'Lets make a fan^cy text!', 'Lets make a fan~~^~~cy text!' );
    } );

    test( "Toggles with ranged selection", function() {
        return TestCommand( 'toggleStrikethrough', 'Lets make less [~~fancy~~} text', 'Lets make less [fancy} text' );
    } );
} );

suite( "Inline code", function() {
    test( "Ranged selection", function() {
        return TestCommand( 'toggleInlineCode', 'Lets make a [fancy} text!', 'Lets make a [`fancy`} text!' );
    } );

    test( "Collapsed selection", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleInlineCode', 'Lets make a fan^cy text!', 'Lets make a fan`^`cy text!' );
    } );

    test( "Toggles with ranged selection", function() {
        return TestCommand( 'toggleInlineCode', 'Lets make less [`fancy`} text', 'Lets make less [fancy} text' );
    } );
} );

suite( "Headers", function() {
    // For headers we'll generate the tests, so that this test suite doesn't get too bloat.
    for ( let i = 1; i <= 6; i++ ) {
        suite( 'Level ' + i, function() {
            var headerMarker = '#'.repeat( i );

            test( "Ranged selection", function() {
                return TestCommand( `toggleTitleH${i}`, 'Lets make a [fancy} text!', `Lets make a [${headerMarker} fancy} text!` );
            } );

            test( "Collapsed selection", function() {
                // This is likely to be changed with #5.
                return TestCommand( `toggleTitleH${i}`, 'Lets make a fan^cy text!', `Lets make a fan${headerMarker} ^cy text!` );
            } );

            test( "Toggles with ranged selection", function() {
                return TestCommand( `toggleTitleH${i}`, `Lets make less [${headerMarker} fancy} text`, 'Lets make less [fancy} text' );
            } );
        } );
    }
} );

var newLine = vscode.workspace.getConfiguration('files').get('eol', '\r\n');
suite( "Block code", function() {
    test( "Ranged selection", function() {
        return TestCommand( 'toggleCodeBlock', '[some code}', '[```\nsome code```}' );
    } );

    test( "Collapsed selection", function() {
        return TestCommand( 'toggleCodeBlock', 'Some code^', 'Some code```\n^```' );
    } );

    test( "Toggles with ranged selection", function() {
        return TestCommand( 'toggleCodeBlock', '[```' + newLine + 'some code```}', '[some code}' );
    } );
} );

// A helper function that generates test case functions.
// Both inputContent and expectedContent can include selection string representation.
// Returns a promise resolving to Promise<TextEditor>.
function TestCommand( command, inputContent, expectedContent ) {
    return vscodeTestContent.setWithSelection( inputContent )
        .then( editor => {
            return vscode.commands.executeCommand( 'md-shortcut.' + command )
                .then(() => assert.strictEqual( vscodeTestContent.getWithSelection( editor ), expectedContent ) )
                .then(() => editor );
        } );
}