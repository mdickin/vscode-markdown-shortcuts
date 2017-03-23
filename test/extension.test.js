/* global suite, test */

var assert = require('assert');
var vscode = require('vscode');
var myExtension = require('../extension');
var vscodeTestContent = require('vscode-test-content');

suite("Bold", function() {
    test("Ranged selection", function() {
        return vscodeTestContent.setWithSelection( 'Lets make a [bold} text!')
            .then( editor => {
                var expectedText = 'Lets make a [**bold**} text!';

                return vscode.commands.executeCommand( 'md-shortcut.toggleBold' )
                    .then( () =>
                        assert.strictEqual( vscodeTestContent.getWithSelection( editor ), expectedText )
                    );
             } )
    });

    test("Toggles with ranged selection", function() {
        return vscodeTestContent.setWithSelection( 'Time to [**unbold**} this statement')
            .then( editor => {
                var expectedText = 'Time to [unbold} this statement';

                return vscode.commands.executeCommand( 'md-shortcut.toggleBold' )
                    .then( () =>
                        assert.strictEqual( vscodeTestContent.getWithSelection( editor ), expectedText )
                    );
             } )
    });
});