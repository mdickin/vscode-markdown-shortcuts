/* global suite, test */

var assert = require( 'assert' );
var vscode = require( 'vscode' );
var myExtension = require( '../extension' );
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