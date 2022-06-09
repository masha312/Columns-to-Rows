let convertToRows;
let currentBlock;
let newBlock;
if (figma.currentPage.selection.length < 1) {
    figma.closePlugin("❌ Please select a table to convert");
}
else if (figma.currentPage.selection.length > 1) {
    figma.closePlugin("❌ Only one table can be selected");
}
else if (figma.currentPage.selection[0].type !== "FRAME") {
    figma.closePlugin("❌ Table should be in a Frame, with Auto Layout");
}
else if (figma.currentPage.selection[0].layoutMode === "NONE") {
    figma.closePlugin("❌ Table should have Auto Layout");
}
else {
    convertTable();
}
function convertTable() {
    convertToRows = checkConversionType();
    const table = figma.currentPage.selection[0];
    const columns = table.children;
    let blocksAreFrames = true;
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].type !== "FRAME") {
            blocksAreFrames = false;
            figma.closePlugin(`❌ ${currentBlock}s should be in a frame`);
        }
    }
    if (blocksAreFrames) {
        let numOfItemsInBlock = columns.length;
        let numOfBlocks = columns[0].children.length;
        let newBlockSpacing = table.itemSpacing;
        let newTableSpacing = columns[0].itemSpacing;
        let blocks = new Array(numOfBlocks);
        for (let i = 0; i < blocks.length; i++) {
            let block = new Array(numOfItemsInBlock);
            for (let c = 0; c < columns.length; c++) {
                block[c] = columns[c].children[i].clone();
            }
            blocks[i] = block;
        }
        while (table.children.length > 0) {
            table.children[0].remove();
        }
        setUpNewBlocks(table, blocks, newBlockSpacing);
        setUpNewTable(table, newTableSpacing);
        figma.closePlugin(`✅ Converted to ${newBlock.toLowerCase()}s succesfully!`);
    }
}
function checkConversionType() {
    if (figma.currentPage.selection[0].layoutMode === "HORIZONTAL") {
        currentBlock = "Column";
        newBlock = "Row";
        return true;
    }
    else {
        currentBlock = "Row";
        newBlock = "Column";
        return false;
    }
}
function setUpNewBlocks(table, blocks, newBlockSpacing) {
    for (let i = 0; i < blocks.length; i++) {
        const blockFrame = figma.createFrame();
        blockFrame.name = "Block";
        if (convertToRows) {
            blockFrame.layoutMode = "HORIZONTAL";
        }
        else {
            blockFrame.layoutMode = "VERTICAL";
        }
        blockFrame.itemSpacing = newBlockSpacing;
        blockFrame.counterAxisSizingMode = "AUTO";
        blockFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 0.86, b: 0.66 }, opacity: 0 }];
        let block = blocks[i];
        for (let c = 0; c < block.length; c++) {
            let item = block[c];
            blockFrame.appendChild(item);
        }
        table.appendChild(blockFrame);
    }
}
function setUpNewTable(table, newTableSpacing) {
    if (convertToRows) {
        table.layoutMode = "VERTICAL";
    }
    else {
        table.layoutMode = "HORIZONTAL";
    }
    table.itemSpacing = newTableSpacing;
}
