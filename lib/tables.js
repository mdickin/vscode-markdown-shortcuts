var vscode = require("vscode");
var editorHelpers = require("./editorHelpers");

module.exports = {
    addTable: () => addTable(false),
    addTableWithHeader: () => addTable(true)
};

var sampleTable = [
    "",
    "Column A | Column B | Column C",
    "---------|----------|---------",
    " A1 | B1 | C1",
    " A2 | B2 | C2",
    " A3 | B3 | C3"
    ].join("\n");

function addTable(addHeader) {
    var editFunc;
    if (!editorHelpers.isAnythingSelected()) {
        editFunc = () => sampleTable;
    }
    else if (addHeader) {
        editFunc = convertToTableWithHeader;
    }
    else {
        editFunc = convertToTableWithoutHeader;
    }
    editorHelpers.replaceBlockSelection(editFunc);
}

var tableColumnSeparator = /([ ]{2,}|[\t])/gi;
function convertToTableWithoutHeader(text) {
    var firstRow = text.match(/.+/); 
    
    var columnSeparators = firstRow == null ? null : firstRow[0].match(tableColumnSeparator);
    var columnCount = columnSeparators == null ? 0 : columnSeparators.length;
    var line1 = [];
    for (var i = 0; i < columnCount + 1; i++) {
        line1.push("column" + i);
    }
    var tableHeader = line1.join(" | ") + "\n";
    tableHeader = tableHeader + tableHeader.replace(/[a-z0-9]/gi, "-");

    return tableHeader + text.replace(tableColumnSeparator, " | ");
}

function convertToTableWithHeader(text) {
    var textAsTable = text.replace(tableColumnSeparator, " | ");

    var firstRow = textAsTable.match(/.+/)[0]; 
    
    var headerLine = firstRow.replace(/[^\|]/gi, "-");
    
    return firstRow + "\n" + headerLine + textAsTable.substring(firstRow.length);
}