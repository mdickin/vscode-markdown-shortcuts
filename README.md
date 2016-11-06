
Handy shortcuts for editing Markdown (`.md`, `.markdown`) files. Now with menu integration!

**Quickly toggle bullet points**
![](https://raw.githubusercontent.com/mdickin/vscode-markdown-shortcuts/master/gifs/bullets.gif)

**Easily generate URLs**
![](https://raw.githubusercontent.com/mdickin/vscode-markdown-shortcuts/master/gifs/urls.gif)

**Note**: extension will override a few default VS Code key bindings (ctrl+B, ctrl+I, ctrl+L), but only when editing Markdown files.

## Exposed Commands

| Name | Description | Default key binding |
| ---- | ----------- | ------------------- |
| md-shortcut.showCommandPalette | Display all commands | ctrl+M ctrl+M |
| md-shortcut.toggleBold | Make \*\*bold\*\* | ctrl+B |
| md-shortcut.toggleItalic | Make \_italic\_ | ctrl+I |
| md-shortcut.toggleHyperlink | Make [a hyperlink]\(www.example.org) | ctrl+L |
| md-shortcut.toggleCodeBlock | Make \`\`\`a code block\`\`\` | ctrl+M ctrl+C |
| md-shortcut.toggleInlineCode | Make \`inline code\` | ctrl+M ctrl+I |
| md-shortcut.toggleBullets | Make * bullet point | ctrl+M ctrl+B |
| md-shortcut.toggleNumbers | Make 1. numbered list | ctrl+M ctrl+1 |
| md-shortcut.toggleCheckboxes | Make - [ ] check list (Github flavored markdown) | ctrl+M ctrl+X |
| md-shortcut.toggleTitleH1 | Toggle # H1 title |  |
| md-shortcut.toggleTitleH2 | Toggle ## H2 title |  |
| md-shortcut.toggleTitleH3 | Toggle ### H3 title |  |
| md-shortcut.toggleTitleH4 | Toggle #### H4 title |  |
| md-shortcut.toggleTitleH5 | Toggle ##### H5 title |  |
| md-shortcut.toggleTitleH6 | Toggle ###### H6 title |  |

## Changelog

**v0.4.0** 
* Added title and context menu shortcuts. Menu icons taken from material.io/icons
* Added checkbox command. Thanks to [@wenbaofu](https://github.com/wenbaofu) for the recommendation!

**v0.3.0**
* Added header shortcuts. Thanks to [@alebaffa](https://github.com/alebaffa) for the contribution!