//Consistent color per number of shapes
// const tileTypes = [
//     { type: "circle", value: 2, color: "#FFBC42" },
//     { type: "circle", value: 4, color: "#D81159" },
//     { type: "circle", value: 6, color: "#218380" },
//     { type: "circle", value: 1, color: "#73D2DE" },

//     { type: "square", value: 2, color: "#FFBC42" },
//     { type: "square", value: 4, color: "#D81159" },
//     { type: "square", value: 6, color: "#218380" },
//     { type: "square", value: 1, color: "#73D2DE" },

//     { type: "star", value: 2, color: "#FFBC42" },
//     { type: "star", value: 4, color: "#D81159" },
//     { type: "star", value: 6, color: "#218380" },
//     { type: "star", value: 1, color: "#73D2DE" },

//     { type: "car", value: 2, color: "#FFBC42" },
//     { type: "car", value: 4, color: "#D81159" },
//     { type: "car", value: 6, color: "#218380" },
//     { type: "car", value: 1, color: "#73D2DE" },

//     { type: "cloud", value: 2, color: "#FFBC42" },
//     { type: "cloud", value: 4, color: "#D81159" },
//     { type: "cloud", value: 6, color: "#218380" },
//     { type: "cloud", value: 1, color: "#73D2DE" },

//     { type: "house", value: 2, color: "#FFBC42" },
//     { type: "house", value: 4, color: "#D81159" },
//     { type: "house", value: 6, color: "#218380" },
//     { type: "house", value: 1, color: "#73D2DE" },

//     { type: "padlock", value: 2, color: "#FFBC42" },
//     { type: "padlock", value: 4, color: "#D81159" },
//     { type: "padlock", value: 6, color: "#218380" },
//     { type: "padlock", value: 1, color: "#73D2DE" },

//     { type: "rocket", value: 2, color: "#FFBC42" },
//     { type: "rocket", value: 4, color: "#D81159" },
//     { type: "rocket", value: 6, color: "#218380" },
//     { type: "rocket", value: 1, color: "#73D2DE" },

//     { type: "umbrella", value: 2, color: "#FFBC42" },
//     { type: "umbrella", value: 4, color: "#D81159" },
//     { type: "umbrella", value: 6, color: "#218380" },
//     { type: "umbrella", value: 1, color: "#73D2DE" },
// ];

//Consistent color per type of shapes
const tileTypes = [
    { type: "circle", value: 2, color: "#f94144" },
    { type: "circle", value: 4, color: "#f94144" },
    { type: "circle", value: 6, color: "#f94144" },
    { type: "circle", value: 1, color: "#f94144" },

    { type: "square", value: 2, color: "#9e2a2b" },
    { type: "square", value: 4, color: "#9e2a2b" },
    { type: "square", value: 6, color: "#9e2a2b" },
    { type: "square", value: 1, color: "#9e2a2b" },

    { type: "star", value: 2, color: "#f8961e" },
    { type: "star", value: 4, color: "#f8961e" },
    { type: "star", value: 6, color: "#f8961e" },
    { type: "star", value: 1, color: "#f8961e" },

    { type: "car", value: 2, color: "#90be6d" },
    { type: "car", value: 4, color: "#90be6d" },
    { type: "car", value: 6, color: "#90be6d" },
    { type: "car", value: 1, color: "#90be6d" },

    { type: "cloud", value: 2, color: "#43aa8b" },
    { type: "cloud", value: 4, color: "#43aa8b" },
    { type: "cloud", value: 6, color: "#43aa8b" },
    { type: "cloud", value: 1, color: "#43aa8b" },

    { type: "house", value: 2, color: "#4d908e" },
    { type: "house", value: 4, color: "#4d908e" },
    { type: "house", value: 6, color: "#4d908e" },
    { type: "house", value: 1, color: "#4d908e" },

    { type: "padlock", value: 2, color: "#577590" },
    { type: "padlock", value: 4, color: "#577590" },
    { type: "padlock", value: 6, color: "#577590" },
    { type: "padlock", value: 1, color: "#577590" },

    { type: "rocket", value: 2, color: "#277da1" },
    { type: "rocket", value: 4, color: "#277da1" },
    { type: "rocket", value: 6, color: "#277da1" },
    { type: "rocket", value: 1, color: "#277da1" },

    { type: "umbrella", value: 2, color: "#9d4edd" },
    { type: "umbrella", value: 4, color: "#9d4edd" },
    { type: "umbrella", value: 6, color: "#9d4edd" },
    { type: "umbrella", value: 1, color: "#9d4edd" },
];

// 2D Array for Layer Dimensions
let layerDimensions1 = [
    [12, 8, 10, 12, 12, 10, 8, 12],
    [0, 6, 8, 10, 10, 8, 6, 0],
    [0, 0, 6, 8, 8, 6, 0, 0],
    [0, 0, 0, 6, 6, 0, 0, 0],
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0]
];

// Board 2:  Wider in the middle 
let layerDimensions2 = [
    [12, 6, 8, 10, 12, 10, 8, 12],
    [0, 4, 6, 10, 12, 10, 4, 0],
    [0, 0, 6, 10, 10, 6, 0, 0],
    [0, 0, 0, 8, 8, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0] // A 'hole' row
];

// Board 3: Steeper sides 
let layerDimensions3 = [
    [12, 6, 6, 8, 8, 6, 6, 12],
    [0, 4, 6, 8, 8, 6, 4, 0],
    [0, 0, 4, 8, 8, 4, 0, 0],
    [0, 0, 2, 4, 4, 2, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

let layerDimensions4 = [
    [12, 8, 9, 10, 11, 9, 7, 12],
    [0, 4, 6, 9, 10, 8, 5, 0],
    [0, 0, 4, 7, 8, 6, 0, 0],
    [0, 0, 2, 5, 6, 0, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

let layerDimensions5 = [
    [12, 6, 7, 9, 11, 9, 7, 12],
    [0, 4, 8, 10, 12, 10, 6, 0],
    [0, 0, 0, 6, 8, 6, 0, 0], // Internal gaps
    [0, 0, 4, 8, 10, 8, 4, 0],
    [0, 0, 0, 0, 4, 0, 0, 0],  // Another gap row
    [0, 0, 0, 0, 2, 0, 0, 0]
];

let layerDimensions6 = [
    [12, 9, 9, 10, 10, 9, 9, 12],
    [0, 6, 7, 9, 9, 7, 6, 0],
    [0, 0, 5, 7, 7, 5, 0, 0],
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

let layerDimensionsTallPyramid = [
    [2, 4, 7, 10, 12, 12, 10, 7, 4, 2],
    [1, 2, 5, 8, 12, 12, 8, 5, 2, 1],
    [0, 1, 3, 6, 10, 10, 6, 3, 1, 0],
    [0, 0, 1, 4, 8, 8, 4, 1, 0, 0],
    [0, 0, 0, 2, 6, 6, 2, 0, 0, 0],
    [0, 0, 0, 0, 2, 2, 0, 0, 0, 0]
];

let layerDimensionsPyramid = [
    [4, 8, 12, 12, 12, 12, 8, 4],
    [2, 6, 10, 10, 10, 10, 6, 2],
    [1, 4, 8, 12, 12, 8, 4, 1],
    [0, 2, 6, 10, 10, 6, 2, 0],
    [0, 0, 4, 8, 8, 4, 0, 0],
    [0, 0, 0, 6, 6, 0, 0, 0]
];

let smallerBoard = [
    [0, 6, 7, 9, 9, 7, 6, 0],
    [0, 0, 5, 7, 7, 5, 0, 0],
    [0, 0, 0, 5, 5, 0, 0, 0]
];

let singleLayerBoard = [
    [4, 6, 8, 10, 10, 8, 6, 4]
]

let superProBoard = [
    [12, 8, 10, 12, 12, 10, 8, 12, 12, 8, 10, 12, 12, 10],
    [0, 6, 8, 10, 10, 8, 6, 0, 0, 6, 8, 10, 10, 8],
    [0, 0, 6, 8, 8, 6, 0, 0, 0, 0, 6, 8, 8, 6],
    [0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 6, 6, 0],
    [0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 0],
    [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0]
];

let boards = [
    layerDimensions1,
    layerDimensions2,
    layerDimensions3,
    layerDimensions4,
    layerDimensions5,
    layerDimensions6,
    layerDimensionsTallPyramid,
    layerDimensionsPyramid
]

function getRandomBoard() {
    return boards[Math.floor(Math.random() * boards.length)]
}

function getEasyBoard() {
    return singleLayerBoard
}

function getBoardByDifficultyLevel(difficultyLevel) {
    if (difficultyLevel == 0)
        return singleLayerBoard

    if (difficultyLevel == 1)
        return smallerBoard

    if (difficultyLevel == 2)
        return getRandomBoard()

    if (difficultyLevel == 3) 
        return superProBoard
}

function canRemoveTiles(tile1pos, tile2pos) {
    if (isSameTile(tile1pos, tile2pos))
        return false;

    const tile1 = mapTiles[tile1pos.layer][tile1pos.row][tile1pos.col];
    const tile2 = mapTiles[tile2pos.layer][tile2pos.row][tile2pos.col];
    if (tile1 && tile2) {
        //Check if tiles are stacked (fix zoom in trick)
        if (tile1pos.row == tile2pos.row && tile1pos.col == tile2pos.col && Math.abs(tile1pos.layer - tile2pos.layer) == 1)
            return false;

        if (isSameTileType(tile1, tile2)) {
            return isTileExposed(tile1pos, strictMode) && isTileExposed(tile2pos, strictMode);
        }
    }
    return false;
}

function isSameTile(tile1pos, tile2pos) {
    if (tile1pos.layer == tile2pos.layer) {
        if (tile1pos.row == tile2pos.row) {
            if (tile1pos.col == tile2pos.col) {
                return true
            }
        }
    }
    return false
}

function isSameTileType(tile1, tile2) {
    return tile1.type == tile2.type && tile1.value == tile2.value && tile1.color == tile2.color
}

function isTileExposed(tilePos, strictMode = true) {

    let tileLeft
    if (tilePos.col > 0)
        tileLeft = mapTiles[tilePos.layer][tilePos.row][tilePos.col - 1]
    else
        tileLeft = null

    let tileRight
    if (tilePos.col < maxCols - 1)
        tileRight = mapTiles[tilePos.layer][tilePos.row][tilePos.col + 1]
    else
        tileRight = null

    let tileNorth
    if (tilePos.row > 0)
        tileNorth = mapTiles[tilePos.layer][tilePos.row - 1][tilePos.col]
    else
        tileNorth = null

    let tileSouth
    if (tilePos.row < mapTiles[tilePos.layer].length - 1)
        tileSouth = mapTiles[tilePos.layer][tilePos.row + 1][tilePos.col]
    else
        tileSouth = null

    if (strictMode)
        return !tileLeft || !tileRight;
    else
        return !tileLeft || !tileRight || !tileNorth || !tileSouth;
}

function totalBoardTiles(board) {
    let total = 0
    for (let layer = 0; layer < board.length; layer++) {
        const currentRow = board[layer]
        for (let column = 0; column < currentRow.length; column++) {
            total += currentRow[column]
        }
    }
    return total
}

function tilesRemainingIn3DMap(map) {
    let total = 0
    for (let layer = 0; layer < map.length; layer++) {
        const currentLayer = map[layer]
        for (let row = 0; row < currentLayer.length; row++) {
            const currentRow = currentLayer[row]
            for (let column = 0; column < currentRow.length; column++) {
                total += currentRow[column] ? 1 : 0
            }
        }
    }
    return total
}

function getTileIdByPos(tilePos) {
    if (tilePos) {
        const tileId = tilePos.layer + "-" + tilePos.row + "-" + tilePos.col;
        return tileId
    }

    return null
}

function getIcon(iconType, color) {

    const square = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 2C3.11929 2 2 3.11929 2 4.5V19.5C2 20.8807 3.11929 22 4.5 22H19.5C20.8807 22 22 20.8807 22 19.5V4.5C22 3.11929 20.8807 2 19.5 2H4.5Z" fill="${color}"/>
            </svg>`

    const circle = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1Z" fill="${color}"/>
            </svg>`

    const car = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" d="M60,28c0-8.301-5.016-24-24-24h-8C9.016,4,4,19.699,4,28c-2.211,0-4,1.789-4,4v16c0,2.211,1.789,4,4,4h4v4
            c0,2.211,1.789,4,4,4h4c2.211,0,4-1.789,4-4v-4h24v4c0,2.211,1.789,4,4,4h4c2.211,0,4-1.789,4-4v-4h4c2.211,0,4-1.789,4-4V32
            C64,29.789,62.211,28,60,28z M16,44c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S18.211,44,16,44z M12,28c0-0.652,0.184-16,16-16
            h8c15.41,0,15.984,14.379,16,16H12z M48,44c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S50.211,44,48,44z"/>
            </svg>`

    const star = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" d="M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265
            C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642
            c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854
            c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72
            c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z"/>
            </svg>`

    const house = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28
            c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16
            c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z"/>
            </svg>`

    const padlock = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" d="M52,24h-4v-8c0-8.836-7.164-16-16-16S16,7.164,16,16v8h-4c-2.211,0-4,1.789-4,4v32c0,2.211,1.789,4,4,4h40
            c2.211,0,4-1.789,4-4V28C56,25.789,54.211,24,52,24z M32,48c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S34.211,48,32,48z M40,24
            H24v-8c0-4.418,3.582-8,8-8s8,3.582,8,8V24z"/>
            </svg>`

    const rocket = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" d="M60,48l-8-4.57c0-4.027,0-8.047,0-11.43c0-12-8-24-20-32C20,8,12,20,12,32c0,3.383,0,7.402,0,11.43L4,48
            c-2.426,1.27-4,2.977-4,5.188V60c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4v-6.812C64,50.977,62.125,49.375,60,48z M32,32
            c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S34.211,32,32,32z"/>
            </svg>`

    const umbrella = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" fill-rule="evenodd" clip-rule="evenodd" d="M32,0C14.328,0,0,14.328,0,32c0,2.211,1.789,4,4,4h24v16
            c0,6.629,5.371,12,12,12s12-5.371,12-12c0-2.211-1.789-4-4-4s-4,1.789-4,4s-1.789,4-4,4s-4-1.789-4-4V36h24c2.211,0,4-1.789,4-4
            C64,14.328,49.672,0,32,0z"/>
            </svg>`

    const cloud = `<svg xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" viewBox="0 0 64 64">
            <path fill="${color}" fill-rule="evenodd" clip-rule="evenodd" d="M55.938,32.707C55.945,32.465,56,32.234,56,31.992
            c0-13.258-10.742-24-24-24s-24,10.742-24,24c0,0.242,0.055,0.473,0.062,0.715C3.379,34.344,0,38.754,0,43.992
            c0,6.625,5.371,12,12,12V56h40v-0.008c6.625,0,12-5.371,12-12C64,38.75,60.617,34.344,55.938,32.707z"/>
            </svg>`

    switch (iconType) {
        case ('square'): return square;
        case ('circle'): return circle;
        case ('car'): return car;
        case ('star'): return star;
        case ('house'): return house;
        case ('padlock'): return padlock;
        case ('rocket'): return rocket;
        case ('umbrella'): return umbrella;
        case ('cloud'): return cloud;
    }
}