
const gameBoard = document.getElementById('game-board');
const header = document.getElementById('header');
const footer = document.getElementById('footer');
const remainingTiles = document.getElementById('remaining-tiles')
const remainingHints = document.getElementById('remaining-hints')

let movements = 0


//  3D Array for Tiles
let mapTiles = [];
const maxCols = 12;

let currentBoard
let selectedTile = null;
let selectedTileType = null;
let selectedTilePosition = {};
let strictMode = true; //Tiles are only exposed if they can be moved left or right, otherwise they can be moved N/S too
let tileCounter
let hintsAvailable

let previousState = []

let settings

function handleUndoClick() {
    if (previousState.length > 0) {
        const savedState = previousState.pop()
        mapTiles = JSON.parse(JSON.stringify(savedState))
        tileCounter = tilesRemainingIn3DMap(mapTiles)

        if (selectedTile) selectedTile.classList.remove('selected')
        selectedTile = null
        selectedTilePosition = {}
        paintTiles()
    }
}

function assignTilesClickHandler() {
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const tileId = tile.id
        const tilePos = tileId.split('-')
        if (tilePos.length == 3) {
            tile.addEventListener('click', () => {
                handleTileClick(tile, tilePos[0], tilePos[1], tilePos[2])
            });
        }
    });
}

function generateTiles() {
    tileCounter = 0
    let tilesToDistribute = []
    const numberOfTilesToCreate = totalBoardTiles(currentBoard);
    let maxTileTypesToUse
    switch (settings.difficulty) {
        case 0: maxTileTypesToUse = 12; break;
        case 1: maxTileTypesToUse = 20; break;
        case 2: maxTileTypesToUse = 28; break;
        default: maxTileTypesToUse = tileTypes.length; break;
    }
    
    for (let i = 0; i < numberOfTilesToCreate; i += 2) {
        //For each tile to create, we create a pair to ensure the puzzle can be solved
        let randomTileType = tileTypes[Math.floor(Math.random() * maxTileTypesToUse)];
        tilesToDistribute.push(randomTileType)
        tilesToDistribute.push(randomTileType)
    }



    for (let layer = 0; layer < currentBoard.length; layer++) {
        let rowArray = mapTiles[layer] ? mapTiles[layer] : [];
        for (let row = 0; row < currentBoard[layer].length; row++) {
            let columnArray = rowArray[row] ? rowArray[row] : [];

            let finishedRowTiles = false
            const columnsInCurrentRow = currentBoard[layer][row]
            let currentRowTiles = 0
            let currentRowStartColumn = Math.ceil((maxCols - columnsInCurrentRow) / 2)

            for (let col = 0; col < maxCols; col++) {
                if (columnsInCurrentRow == 0) {
                    columnArray[col] = null;
                    continue; //Next iteration
                }

                if (!finishedRowTiles) {
                    if (col < currentRowStartColumn) {
                        columnArray[col] = null;
                    } else {
                        //Get one tile from the tilesToDistribute, place it on the columnArray and remove it from the tilesToDistribute
                        const tilePositionInArray = Math.floor(Math.random() * tilesToDistribute.length)
                        columnArray[col] = tilesToDistribute[tilePositionInArray];
                        tilesToDistribute.splice(tilePositionInArray, 1)

                        currentRowTiles++;
                        finishedRowTiles = currentRowTiles >= currentBoard[layer][row];
                        tileCounter++;
                    }
                } else {
                    columnArray[col] = null;
                }
            }

            rowArray[row] = columnArray;
        }
        mapTiles[layer] = rowArray;
    }
}


function showHint() {
    if (hintsAvailable > 0) {
        document.getElementById('button-hint').style = "filter: saturate(1);"
        const matchingTilePos = findMatchingTile()
        if (matchingTilePos) {
            //const tileId = matchingTilePos.layer + "-" + matchingTilePos.row + "-" + matchingTilePos.col;
            let matchingTile = document.getElementById(getTileIdByPos(matchingTilePos));
            matchingTile.classList.add('hint')
            setTimeout(() => {
                matchingTile.classList.remove('hint')
            }, 3000)
            hintsAvailable--;
            remainingHints.innerText = hintsAvailable + " hints"

            if (hintsAvailable == 0)
                document.getElementById('button-hint').style = "filter: saturate(0);"
        }
    } else {
        document.getElementById('button-hint').style = "filter: saturate(0);"
    }
}

function findMatchingTile() {
    if (!selectedTile) {
        alert('You need to select a tile first to show a hint')
        return null;
    }

    for (let layer = mapTiles.length - 1; layer >= 0; layer--) {
        const currentLayer = mapTiles[layer]
        for (let row = 0; row < currentLayer.length; row++) {
            const currentRow = currentLayer[row]
            for (let col = 0; col < currentRow.length; col++) {
                const probingTilePos = {
                    layer: layer,
                    row: row,
                    col: col
                }
                if (canRemoveTiles(selectedTilePosition, probingTilePos))
                    return probingTilePos
            }
        }
    }
    return null
}


function handleTileClick(tile, layerIndex, rowIndex, colIndex) {
    if (!selectedTile) {
        selectedTile = tile
        selectedTileType = mapTiles[layerIndex][rowIndex][colIndex];
        selectedTilePosition = {
            layer: layerIndex,
            row: rowIndex,
            col: colIndex
        };
        tile.classList.add('selected')
        return;
    }

    const secondTileType = mapTiles[layerIndex][rowIndex][colIndex];
    const secondTilePosition = {
        layer: layerIndex,
        row: rowIndex,
        col: colIndex
    };

    if (canRemoveTiles(selectedTilePosition, secondTilePosition)) {
        //Deep copy current state to previousState array
        previousState.push(JSON.parse(JSON.stringify(mapTiles)));
        removeTiles(selectedTilePosition, secondTilePosition);
        paintTiles();
    } else {
        selectedTile.classList.remove('selected')
        selectedTile = null
        selectedTilePosition = {}
    }
    movements++;

}


function removeTiles(tile1pos, tile2pos) {
    mapTiles[tile1pos.layer][tile1pos.row][tile1pos.col] = null
    mapTiles[tile2pos.layer][tile2pos.row][tile2pos.col] = null
    selectedTile = null
    selectedTilePosition = {}
    tileCounter = tileCounter - 2;
    if (tileCounter == 0)
        fireConfetti()
}


function createTileShapeContainer(tile) {
    // Create shape container
    const shapeContainer = document.createElement('div');
    shapeContainer.classList.add('shape-container');

    // Create shapes 
    for (let i = 0; i < tile.value; i++) {
        let shapeDiv = document.createElement('div');
        shapeDiv.innerHTML = getIcon(tile.type, tile.color);
        shapeContainer.appendChild(shapeDiv);
    }
    return shapeContainer;
}

function paintTiles() {
    gameBoard.innerHTML = '';
    remainingTiles.innerText = tileCounter
    remainingHints.innerText = hintsAvailable + " hints"

    // Iterate over base layer 
    for (let currentLayer = 0; currentLayer < currentBoard.length; currentLayer++) {
        for (let currentRow = 0; currentRow < currentBoard[currentLayer].length; currentRow++) {

            for (let tileIndexInRow = 0; tileIndexInRow < maxCols; tileIndexInRow++) {
                const currentTile = mapTiles[currentLayer][currentRow][tileIndexInRow];

                // Create tile div)
                let tileDiv = document.createElement('div');
                tileDiv.classList.add('tile');
                // Dynamic grid placement 
                tileDiv.style.gridRow = currentRow + 1;
                tileDiv.style.gridColumn = tileIndexInRow + 1;

                if (!currentTile) {
                    tileDiv.classList.add('tile-empty');
                    tileDiv.style.zIndex = -1; //Make sure it does not interfere with tiles above
                } else {

                    // Assuming 'type' property stores your tile type information
                    tileDiv.style.color = currentTile.color;
                    tileDiv.style.zIndex = currentLayer;
                    tileDiv.id = `${currentLayer}-${currentRow}-${tileIndexInRow}`;
                    tileDiv.style.left = (currentLayer * 5) + 'px';
                    tileDiv.style.top = (currentLayer * -5) + 'px';

                    tileDiv.addEventListener('click', () => {

                        handleTileClick(tileDiv, currentLayer, currentRow, tileIndexInRow); // Pass indices
                    });
                    tileDiv.appendChild(createTileShapeContainer(currentTile));

                }

                gameBoard.appendChild(tileDiv);
            }
        }
    }
}

function fireConfetti() {
    const duration = 15 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    confettiInterval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(confettiInterval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
}

function loadSettings() {
    let savedSettings = localStorage.getItem('mahjongSettings');
    settings = savedSettings ? JSON.parse(savedSettings) : {
        difficulty: 0 //Default difficulty
    };
    document.getElementById('difficulty-level').value = settings.difficulty;
}

function saveSettings() {
    settings.difficulty = parseInt(document.getElementById('difficulty-level').value);
    localStorage.setItem('mahjongSettings', JSON.stringify(settings));
}

function newGame() {
    saveSettings();
    previousState = []
    currentBoard = getBoardByDifficultyLevel(settings.difficulty)
    hintsAvailable = 5
    document.getElementById('button-hint').style = "filter: saturate(1);"
    generateTiles();
    paintTiles()
    viewportResize();
}

loadSettings()
addEventListeners()
newGame()

function viewportResize() {
    const currentWidth = window.visualViewport.width;
    header.style.width = currentWidth + 'px';

    const footerHeight = 80
    footer.style.width = currentWidth + 'px';
    footer.style.top = (window.visualViewport.height - footerHeight - 5) + "px"
    footer.style.height = footerHeight + "px"
}


function addEventListeners() {
    document.getElementById('button-newgame').addEventListener('click', newGame);
    window.addEventListener('resize', viewportResize);
    document.getElementById('button-hint').addEventListener('click', showHint)
    document.getElementById('difficulty-level').addEventListener('change', newGame)
    document.getElementById('button-undo').addEventListener('click', handleUndoClick)
}
