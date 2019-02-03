## Version History

## v0.10.0 (February 3, 2019)

* Added configuration item to allow Markdown Shortcuts to be used on other file types
* Fixed issue where blank lines were not being marked as citations when selecting blocks of text
* Fixed issue with "auto" being inserted as newline

Thank you to [@raulrpearson](https://github.com/raulrpearson) for their contribution in supporting other file types!

## v0.9.0 (November 5, 2018)

* Added configuration item to use asterisks for italics markers (defaults to underscore)
* Added configuration item to use dashes or plus signs for bullet point markers (defaults to asterisks)
* Added shortcut for citations

Thank you to [@FFengIll](https://github.com/FFengIll) for their contributions for citations and configurable bullet points!

## v0.8.1 (May 2, 2017)

* Fixed word selection for words with unicode characters

## v0.8.0 (March 25, 2017)

* Added "surrounding word" feature for commands. This means that you can now place your cursor on a word and toggle bold, italic, etc. No need to highlight the whole word!
* Fixed issue with newlines in block code command
* Added missing H1-H6 commands to VS Code command palette

Huge thank you to [@mlewand](https://github.com/mlewand) for his contributions and excellent [unit test library](https://www.npmjs.com/package/vscode-test-content).

## v0.7.1 (March 12, 2017)

* Fixed bug with image shortcut where hitting Escape on the prompts would not cancel
* Added support for optional alt tags in images

## v0.7.0 (March 11, 2017)

* Added image shortcut (ctrl+shift+L). Thanks to [@ngtrian](https://github.com/ngtrian) for the recommendation!
* Added configuration settings to show/hide icons in the title bar

## v0.6.1 (February 11, 2017)

* Fixed issue with Changelog not displaying in Visual Studio Extensions gallery

## v0.6.0 (February 11, 2017)

* Added icon. Thanks to [@LaChRiZ](https://github.com/LaChRiZ) for the contribution!
* Modified link shortcut (ctrl+L) to surround URLs with angle brackets. Thanks to [@StephD](https://github.com/StephD)
for the recommendation!

## v0.5.0 (December 3, 2016)

* Added strikethrough shortcut. Thanks to [@seanmft](https://github.com/seanmft) for the contribution!
* Added support for block selection. This allows you to select a subset of a block of text,
and it will automatically find the start and end of the block. This applies to:
  * Bullet, number, and checkbox lists
  * Code blocks
  * Tables
* Fixed bug where numbered list was adding "1" twice

## v0.4.1 (November 17, 2016)

* Added bullets icon to title menu
* Improved ordering of menu items

## v0.4.0 (November 7, 2016)

* Added title and context menu shortcuts. Menu icons taken from <http://material.io/icons>
* Added checkbox and table commands. Thanks to [@wenbaofu](https://github.com/wenbaofu) for the recommendations!

## v0.3.0 (August 12, 2016)

* Added header shortcuts. Thanks to [@alebaffa](https://github.com/alebaffa) for the contribution!