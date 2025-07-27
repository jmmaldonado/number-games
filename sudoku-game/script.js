document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const boardElement = document.getElementById('board');
    const numberPaletteElement = document.getElementById('number-palette');
    const numberPaletteRow1 = document.getElementById('number-palette-row-1');
    const numberPaletteRow2 = document.getElementById('number-palette-row-2');
    const complexitySelect = document.getElementById('complexity');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('new-game');
    const checkAnswerBtn = document.getElementById('check-answer');
    const showSolutionBtn = document.getElementById('show-solution');
    const hintBtn = document.getElementById('hint');
    const undoBtn = document.getElementById('undo');
    const redoBtn = document.getElementById('redo');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const themeSwitcherBtn = document.getElementById('theme-switcher');
    const statsModal = document.getElementById('stats-modal'); // Keep for now, but it's hidden
    const closeStatsBtn = statsModal.querySelector('.close-button'); // Keep for now, but it's hidden
    const statsBody = document.getElementById('stats-body'); // Keep for now, but it's hidden

    // Game State
    let size = 9;
    let difficulty = 'medium';
    let board = [];
    let solution = [];
    let selectedCell = null;
    let timerInterval = null;
    let score = 0;
    let time = 0;
    let undoStack = [];
    let redoStack = [];

    // --- CORE GAME LOGIC ---

    function createEmptyBoard() {
        return Array(size * size).fill(0);
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < size; i++) {
            if (board[row * size + i] === num || board[i * size + col] === num) {
                return false;
            }
        }

        const subgridSize = Math.sqrt(size);
        const startRow = row - row % subgridSize;
        const startCol = col - col % subgridSize;
        for (let i = 0; i < subgridSize; i++) {
            for (let j = 0; j < subgridSize; j++) {
                if (board[(startRow + i) * size + (startCol + j)] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function solve(board) {
        for (let i = 0; i < size * size; i++) {
            if (board[i] === 0) {
                const row = Math.floor(i / size);
                const col = i % size;
                const numbers = shuffle([...Array(size).keys()].map(n => n + 1));
                for (const num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[i] = num;
                        if (solve(board)) {
                            return true;
                        }
                        board[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }
    
    function removeNumbers(board) {
        let attempts;
        switch (difficulty) {
            case 'easy':
                attempts = Math.floor(size * size * 0.4);
                break;
            case 'hard':
                attempts = Math.floor(size * size * 0.6);
                break;
            case 'medium':
            default:
                attempts = Math.floor(size * size * 0.5);
                break;
        }

        let removed = 0;
        while (removed < attempts && removed < size * size) {
            const index = Math.floor(Math.random() * size * size);
            if (board[index] !== 0) {
                board[index] = 0;
                removed++;
            }
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateSudoku() {
        console.log(`Generating a ${size}x${size} board with ${difficulty} difficulty.`);
        let tempBoard = createEmptyBoard();
        solve(tempBoard);
        solution = [...tempBoard];
        
        removeNumbers(tempBoard);
        board = tempBoard;
        
        undoStack = [];
        redoStack = [];
        updateUndoRedoButtons();
        startTimer();
        renderBoard();
        renderNumberPalette();
        saveGameState();
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        boardElement.className = `size-${size}`;
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            if (board[i] !== 0) {
                cell.textContent = board[i];
                cell.classList.add('fixed');
            }
            // Add thick borders for subgrids
            const subgridSize = Math.sqrt(size);
            const row = Math.floor(i / size);
            const col = i % size;
            if ((col + 1) % subgridSize === 0 && col < size - 1) {
                cell.style.borderRight = '3px solid var(--text-color)';
            }
            if ((row + 1) % subgridSize === 0 && row < size - 1) {
                cell.style.borderBottom = '3px solid var(--text-color)';
            }
            boardElement.appendChild(cell);
        }
    }

    function renderNumberPalette() {
        numberPaletteRow1.innerHTML = '';
        numberPaletteRow2.innerHTML = '';

        for (let i = 1; i <= size; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.addEventListener('click', () => handleNumberInput(i));
            if (size === 9 && i <= 5) {
                numberPaletteRow1.appendChild(btn);
            } else if (size === 9 && i > 5) {
                numberPaletteRow2.appendChild(btn);
            } else {
                numberPaletteRow1.appendChild(btn); // For 4x4, all in one row
            }
        }
        if (size === 9) {
            const draftBtn = document.createElement('button');
            draftBtn.textContent = '✏️';
            draftBtn.addEventListener('click', toggleDraftMode);
            numberPaletteRow2.appendChild(draftBtn);
        } else {
            const draftBtn = document.createElement('button');
            draftBtn.textContent = '✏️';
            draftBtn.addEventListener('click', toggleDraftMode);
            numberPaletteRow1.appendChild(draftBtn);
        }
    }

    function handleCellClick(event) {
        const target = event.target.closest('.cell');
        if (!target) return;

        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = target;
        selectedCell.classList.add('selected');
    }

    function handleNumberInput(num) {
        if (!selectedCell || selectedCell.classList.contains('fixed')) return;

        const index = parseInt(selectedCell.dataset.index);
        const prevValue = board[index];
        
        if (selectedCell.classList.contains('draft-active')) {
            // Draft mode logic - does not affect undo stack
            let draftGrid = selectedCell.querySelector('.draft-grid');
            if (!draftGrid) {
                draftGrid = document.createElement('div');
                draftGrid.className = 'draft-grid';
                for(let i=1; i<=size; i++) {
                    const draftCell = document.createElement('div');
                    draftCell.className = 'draft-cell';
                    draftCell.dataset.num = i;
                    draftGrid.appendChild(draftCell);
                }
                selectedCell.appendChild(draftGrid);
            }
            const draftCell = draftGrid.querySelector(`[data-num='${num}']`);
            if (draftCell.textContent) {
                draftCell.textContent = '';
            } else {
                draftCell.textContent = num;
            }
            selectedCell.querySelector('span:not(.draft-cell)')?.remove();
            if (board[index] !== 0) {
                pushToUndo({ index, value: prevValue });
                board[index] = 0;
            }

        } else {
            // Normal input mode
            if (selectedCell.querySelector('.draft-grid')) {
                selectedCell.querySelector('.draft-grid').remove();
            }
            pushToUndo({ index, value: prevValue });
            selectedCell.textContent = num;
            board[index] = num;
        }
        saveGameState();
    }

    function toggleDraftMode() {
        const draftBtn = numberPaletteElement.querySelector('button:last-child');
        if (selectedCell) {
            selectedCell.classList.toggle('draft-active');
        }
        // Also toggle a class on the button itself for visual feedback
        if (selectedCell && selectedCell.classList.contains('draft-active')) {
            draftBtn.style.backgroundColor = 'var(--draft-mode-bg)';
        } else {
            draftBtn.style.backgroundColor = '';
        }
    }

    // --- GAME ACTIONS ---

    function checkAnswer() {
        for (let i = 0; i < size * size; i++) {
            const cell = boardElement.querySelector(`[data-index='${i}']`);
            if (!cell.classList.contains('fixed')) {
                if (board[i] !== 0 && board[i] !== solution[i]) {
                    cell.classList.add('incorrect');
                } else {
                    cell.classList.remove('incorrect');
                }
            }
        }
    }

    function showSolution() {
        board = [...solution];
        renderBoard();
    }

    function giveHint() {
        let hintIndex = -1;

        if (selectedCell && board[parseInt(selectedCell.dataset.index)] === 0) {
            hintIndex = parseInt(selectedCell.dataset.index);
        } else {
            const emptyCells = [];
            for (let i = 0; i < size * size; i++) {
                if (board[i] === 0) {
                    emptyCells.push(i);
                }
            }
            if (emptyCells.length > 0) {
                hintIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
        }

        if (hintIndex !== -1) {
            pushToUndo({ index: hintIndex, value: board[hintIndex] });
            board[hintIndex] = solution[hintIndex];
            renderBoard();
            saveGameState();
        }
    }

    // --- TIMER AND SCORE ---
    function startTimer() {
        clearInterval(timerInterval);
        time = 0;
        timerInterval = setInterval(() => {
            time++;
            const minutes = Math.floor(time / 60).toString().padStart(2, '0');
            const seconds = (time % 60).toString().padStart(2, '0');
            timerElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    // --- UNDO/REDO ---
    function pushToUndo(move) {
        undoStack.push(move);
        redoStack = []; // Clear redo stack on new move
        updateUndoRedoButtons();
    }

    function undo() {
        if (undoStack.length === 0) return;
        const lastMove = undoStack.pop();
        redoStack.push({ index: lastMove.index, value: board[lastMove.index] });
        board[lastMove.index] = lastMove.value;
        renderBoard();
        updateUndoRedoButtons();
    }

    function redo() {
        if (redoStack.length === 0) return;
        const lastRedo = redoStack.pop();
        undoStack.push({ index: lastRedo.index, value: board[lastRedo.index] });
        board[lastRedo.index] = lastRedo.value;
        renderBoard();
        updateUndoRedoButtons();
    }

    function updateUndoRedoButtons() {
        undoBtn.disabled = undoStack.length === 0;
        redoBtn.disabled = redoStack.length === 0;
    }
    
    // --- PERSISTENCE ---
    function saveGameState() {
        const gameState = {
            board,
            solution,
            size,
            difficulty,
            time,
            score,
            undoStack,
            redoStack
        };
        localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
    }

    function loadGameState() {
        const savedState = localStorage.getItem('sudokuGameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            board = gameState.board;
            solution = gameState.solution;
            size = gameState.size;
            difficulty = gameState.difficulty;
            time = gameState.time;
            score = gameState.score;
            undoStack = gameState.undoStack;
            redoStack = gameState.redoStack;
            return true;
        }
        return false;
    }

    // --- EVENT LISTENERS ---

    boardElement.addEventListener('click', handleCellClick);
    checkAnswerBtn.addEventListener('click', checkAnswer);
    showSolutionBtn.addEventListener('click', showSolution);
    hintBtn.addEventListener('click', giveHint);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);

    newGameBtn.addEventListener('click', () => {
        size = parseInt(complexitySelect.value);
        difficulty = difficultySelect.value;
        generateSudoku();
    });

    themeSwitcherBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeSwitcherBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    closeStatsBtn.addEventListener('click', () => statsModal.classList.add('hidden'));
    window.addEventListener('click', (e) => {
        if (e.target === statsModal) {
            statsModal.classList.add('hidden');
        }
    });

    // --- INITIALIZATION ---
    function init() {
        if (loadGameState()) {
            complexitySelect.value = size;
            difficultySelect.value = difficulty;
            renderBoard();
            renderNumberPalette();
            updateUndoRedoButtons();
            startTimer(); // Resumes timer from saved time
        } else {
            size = parseInt(complexitySelect.value);
            difficulty = difficultySelect.value;
            generateSudoku();
        }
    }

    init();
});
