/* global suite, test */

var assert = require( 'assert' );
var vscode = require( 'vscode' );
var vscodeTestContent = require( 'vscode-test-content' );
var env = require('../lib/env');

suite( "Bold", function() {
    test( "Ranged selection", function() {
        return TestCommand( 'toggleBold', 'Lets make a [bold} text!', 'Lets make a [**bold**} text!' );
    } );

    test( "Collapsed selection", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleBold', 'Lets make a bo^ld text!', 'Lets make a [**bold**} text!' );
    } );

    test( "Collapsed selection with unicode characters", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleBold', 'Lets make a bÔ^ld text!', 'Lets make a [**bÔld**} text!' );
    } );

    test( "Collapsed selection empty editor", function() {
        // make sure nothing wrong happens when the editor is totally empty.
        return TestCommand( 'toggleBold', '^', '**^**' );
    } );
    
    test( "Collapsed selection empty surround editor", function() {
        // make sure nothing wrong happens when the editor is surrounded by bold.
        return TestCommand( 'toggleBold', '**^**', '^' );
    } );

    test( "Toggles with collapsed selection", function() {
        return TestCommand( 'toggleBold', 'Time to **unbo^ld** this statement', 'Time to [unbold} this statement' );
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
        return TestCommand( 'toggleItalic', 'Lets make a fan^cy text!', 'Lets make a [_fancy_} text!' );
    } );

    test( "Collapsed selection with unicode characters", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleItalic', 'Lets make a fÄn^cy text!', 'Lets make a [_fÄncy_} text!' );
    } );

    test( "Toggles with collapsed selection", function() {
        return TestCommand( 'toggleItalic', 'Lets make less _fan^cy_ text', 'Lets make less [fancy} text' );
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
        return TestCommand( 'toggleStrikethrough', 'Lets make a fan^cy text!', 'Lets make a [~~fancy~~} text!' );
    } );

    test( "Collapsed selection with unicode characters", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleStrikethrough', 'Lets make a fÄn^cy text!', 'Lets make a [~~fÄncy~~} text!' );
    } );

    test( "Toggles with collapsed selection", function() {
        return TestCommand( 'toggleStrikethrough', 'Lets make less ~~fan^cy~~ text', 'Lets make less [fancy} text' );
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
        return TestCommand( 'toggleInlineCode', 'Lets make a fan^cy text!', 'Lets make a [`fancy`} text!' );
    } );

    test( "Collapsed selection with unicode selection", function() {
        // This is likely to be changed with #5.
        return TestCommand( 'toggleInlineCode', 'Lets make a fÄn^cy text!', 'Lets make a [`fÄncy`} text!' );
    } );

    test( "Toggles with collapsed selection", function() {
        return TestCommand( 'toggleInlineCode', 'Lets make less `fa^ncy` text', 'Lets make less [fancy} text' );
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
                return TestCommand( `toggleTitleH${i}`, 'Lets make a fan^cy text!', `[${headerMarker} Lets make a fancy text!}` );
            } );

            test( "Collapsed selection with newline", function() {
                // This is likely to be changed with #5.
                return TestCommand( `toggleTitleH${i}`, 'Lets make a fan^cy text!\nAnother line', `[${headerMarker} Lets make a fancy text!}\nAnother line` );
            } );

            test( "Toggles with ranged selection", function() {
                return TestCommand( `toggleTitleH${i}`, `[${headerMarker} Lets make less fancy text}`, '[Lets make less fancy text}' );
            } );

            test( "Toggles with collapsed selection", function() {
                return TestCommand( `toggleTitleH${i}`, `${headerMarker} Lets make ^less fancy text`, '[Lets make less fancy text}' );
            } );
        } );
    }
} );

var newLine = env.getEol();
suite( "Block code", function() {
    test( "Ranged selection", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            '[some code}', 
            '[```\nsome code\n```}' );
    } );

    test( "Multiline ranged selection", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            '[some code' + newLine + 'more code}', 
            '[```\nsome code\nmore code\n```}' );
    } );

    test( "Multiline ranged selection with extra newline", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            '[some code' + newLine + 'more code}' + newLine, 
            '[```\nsome code\nmore code\n```}');
    } );

    test( "Multiline ranged selection while selecting extra newline", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            '[some code' + newLine + 'more code' + newLine + '}', 
            '[```\nsome code\nmore code\n\n```}');
    } );

    test( "Collapsed selection", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            'Some code^', 
            '[```\nSome code\n```}' );
    } );

    test( "Toggles with ranged selection", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            '[```\nsome code\n```}', 
            '[some code}' );
    } );

    test( "Toggles with multi-line ranged selection", function() {
        return TestCommand( 
            'toggleCodeBlock', 
            '[```' + newLine + 'some code' + newLine + 'more code' + newLine + '```}', 
            '[some code\nmore code}' );
    } );

    //TODO: are these possible?
    // test( "Toggles with collapsed selection", function() {
    //     return TestCommand( 'toggleCodeBlock', '```' + newLine + 'some^ code' + newLine + '```', '[some code}' );
    // } );

    // test( "Toggles with multiline collapsed selection", function() {
    //     return TestCommand( 'toggleCodeBlock', '```' + newLine + 'some^ code' + newLine + 'more code' + newLine + '```', '[some code\nmore code}' );
    // } );
} );

suite("Bullets", function () {
    // beforeEach(() => {
    // });

    test("Collapsed selection", function () {
        return TestCommand( 'toggleBullets', 
            'A line for bul^lets', 
            '[* A line for bullets}');
    })

    test("Ranged selection", function () {
        return TestCommand( 'toggleBullets', 
            'A li[st\nOf Ite}ms', 
            '* A [list\n* Of} Items');
    })
    
    test("Toggles with collapsed selection", function () {
        return TestCommand( 'toggleBullets', 
            '* A line for bul^lets', 
            '[A line for bullets}');
    })
    
    test("Toggles with ranged selection", function () {
        return TestCommand( 'toggleBullets', 
            '* A bullet[ed li}st', 
            'A bulleted[ list}');
    })
    
    test("Toggles with multi-line ranged selection", function () {
        return TestCommand( 'toggleBullets', 
            '* A li[st\n* Of Ite}ms', 
            'A list[\nOf Items}');
    })
});

suite("Citations", function () {

    test("Collapsed selection", function () {
        return TestCommand( 
            'toggleCitations', 
            'A line for ci^tation', 
            '[> A line for citation}');
    })

    test("Ranged selection", function () {
        return TestCommand( 
            'toggleCitations', 
            'A li[st\nOf Citatio}ns', 
            '> A li[st\n> Of Citatio}ns');
    })

    test("Ranged selection with blank lines", function () {
        return TestCommand( 
            'toggleCitations', 
            'A li[st\n\n\nOf Citatio}ns', 
            '> A li[st\n> \n> \n> Of Citatio}ns');
    })
    
    test("Toggles with collapsed selection", function () {
        return TestCommand( 
            'toggleCitations', 
            '> A line for ci^tation', 
            '[A line for citation}');
    })
    
    test("Toggles with ranged selection", function () {
        return TestCommand( 
            'toggleCitations', 
            '> A norm[al citatio}n', 
            'A normal[ citation}');
    })
    
    test("Toggles with multi-line ranged selection", function () {
        return TestCommand( 
            'toggleCitations', 
            '> A li[st\n> Of Citatio}ns', 
            'A list[\nOf Citations}');
    })
});

suite( "URLs", function() {
    //TODO: figure out how to mock the input selections to generate links

    //TODO: need to be able to escape URL brackets to avoid them being interpreted as selections
    // test( "Toggles with collapsed selection", function() {
    //     return TestCommand( 'toggleLink', 'A [nice url](http://www.g^oogle.com) here', 'A [nice url} here', customMarkers );
    // } );

    // test( "Toggles with ranged selection", function() {
    //     return TestCommand( 'toggleLink', 'A [\[nice url\](http://www.google.com)} here', 'A [nice url} here', customMarkers );
    // } );
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