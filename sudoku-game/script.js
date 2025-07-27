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
    const celebrationModal = document.getElementById('celebration-modal');
    const closeCelebrationModalBtn = document.getElementById('close-celebration-modal');
    const finalTimeElement = document.getElementById('final-time');

    // Game State
    let size = 9;
    let difficulty = 'medium';
    let board = [];
    let initialBoard = [];
    let solution = [];
    let selectedCell = null;
    let timerInterval = null;
    let score = 0;
    let time = 0;
    let undoStack = [];
    let redoStack = [];
    let isDraftMode = false;
    let drafts = [];

    // --- CORE GAME LOGIC ---

    function createEmptyBoard() {
        return Array(size * size).fill(0);
    }

    function isValid(currentBoard, row, col, num) {
        for (let i = 0; i < size; i++) {
            if (currentBoard[row * size + i] === num && i !== col) {
                return false;
            }
            if (currentBoard[i * size + col] === num && i !== row) {
                return false;
            }
        }

        const subgridSize = Math.sqrt(size);
        const startRow = row - row % subgridSize;
        const startCol = col - col % subgridSize;
        for (let i = 0; i < subgridSize; i++) {
            for (let j = 0; j < subgridSize; j++) {
                const cellIndex = (startRow + i) * size + (startCol + j);
                if (currentBoard[cellIndex] === num && cellIndex !== (row * size + col)) {
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
        initialBoard = [...board];
        drafts = Array(size * size).fill(null).map(() => []);
        selectedCell = null;
        
        undoStack = [];
        redoStack = [];
        updateUndoRedoButtons();
        startTimer();
        renderBoard();
        renderNumberPalette();
        saveGameState();
    }

    function renderBoard() {
        const selectedIndex = selectedCell ? parseInt(selectedCell.dataset.index) : -1;
        boardElement.innerHTML = '';
        boardElement.className = `size-${size}`;
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;

            if (initialBoard[i] !== 0) {
                cell.textContent = board[i];
                cell.classList.add('fixed');
            } else if (board[i] !== 0) {
                cell.textContent = board[i];
            } else if (drafts[i] && drafts[i].length > 0) {
                const draftGrid = document.createElement('div');
                draftGrid.className = 'draft-grid';
                for (let k = 1; k <= size; k++) {
                    const draftCell = document.createElement('div');
                    draftCell.className = 'draft-cell';
                    if (drafts[i].includes(k)) {
                        draftCell.textContent = k;
                    }
                    draftGrid.appendChild(draftCell);
                }
                cell.appendChild(draftGrid);
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

        if (selectedIndex !== -1) {
            selectedCell = boardElement.querySelector(`[data-index='${selectedIndex}']`);
            if (selectedCell) {
                selectedCell.classList.add('selected');
                if (isDraftMode) {
                    selectedCell.classList.add('draft-active');
                }
            }
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
        
        const draftBtn = document.createElement('button');
        draftBtn.id = 'draft-mode-btn';
        draftBtn.textContent = '✏️';
        draftBtn.addEventListener('click', toggleDraftMode);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️';
        clearBtn.addEventListener('click', clearCell);

        if (size === 9) {
            numberPaletteRow2.appendChild(draftBtn);
            numberPaletteRow2.appendChild(clearBtn);
        } else {
            numberPaletteRow1.appendChild(draftBtn);
            numberPaletteRow1.appendChild(clearBtn);
        }
    }

    function handleCellClick(event) {
        const target = event.target.closest('.cell');
        if (!target) return;

        if (selectedCell) {
            selectedCell.classList.remove('selected');
            selectedCell.classList.remove('draft-active');
        }
        selectedCell = target;
        selectedCell.classList.add('selected');
        if (isDraftMode) {
            selectedCell.classList.add('draft-active');
        }
    }

    function clearCell() {
        if (!selectedCell || selectedCell.classList.contains('fixed')) return;

        const index = parseInt(selectedCell.dataset.index);
        const prevBoardValue = board[index];
        const prevDrafts = [...drafts[index]];

        if (prevBoardValue === 0 && prevDrafts.length === 0) return; // Nothing to clear

        pushToUndo({ index, boardValue: prevBoardValue, draftValues: prevDrafts, type: 'clear' });

        board[index] = 0;
        drafts[index] = [];

        renderBoard();
        saveGameState();
    }

    function handleNumberInput(num) {
        if (!selectedCell || selectedCell.classList.contains('fixed')) return;

        const index = parseInt(selectedCell.dataset.index);
        const prevBoardValue = board[index];
        const prevDrafts = [...drafts[index]];

        if (isDraftMode) {
            const draftIndex = drafts[index].indexOf(num);
            if (draftIndex > -1) {
                drafts[index].splice(draftIndex, 1);
            } else {
                drafts[index].push(num);
            }
            board[index] = 0; // Clear final number if drafting
            pushToUndo({ index, boardValue: prevBoardValue, draftValues: prevDrafts, type: 'draft' });
        } else {
            // Normal input mode
            drafts[index] = [];
            board[index] = num;
            pushToUndo({ index, boardValue: prevBoardValue, draftValues: prevDrafts, type: 'final' });
        }
        
        renderBoard();
        saveGameState();
        checkIfBoardIsFilled();
    }

    function toggleDraftMode() {
        isDraftMode = !isDraftMode;
        const draftBtn = document.getElementById('draft-mode-btn');
        draftBtn.classList.toggle('active-draft-button');

        // Update visual state of the selected cell
        if (selectedCell) {
            if (isDraftMode) {
                selectedCell.classList.add('draft-active');
            } else {
                selectedCell.classList.remove('draft-active');
            }
        }
    }

    // --- GAME ACTIONS ---

    function checkAnswer(autoValidate = false) {
        let hasIncorrectCells = false;
        for (let i = 0; i < size * size; i++) {
            const cell = boardElement.querySelector(`[data-index='${i}']`);
            const row = Math.floor(i / size);
            const col = i % size;
            const num = board[i];

            if (!cell.classList.contains('fixed')) {
                if (num !== 0 && (!isValid(board, row, col, num) || num !== solution[i])) {
                    cell.classList.add('incorrect');
                    hasIncorrectCells = true;
                } else {
                    cell.classList.remove('incorrect');
                }
            }
        }

        const isBoardCompletelyFilled = isBoardFilled();

        if (autoValidate && isBoardCompletelyFilled && !hasIncorrectCells) {
            showCelebration();
        }
        return !hasIncorrectCells;
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
            const prevBoardValue = board[hintIndex];
            const prevDrafts = [...drafts[hintIndex]];
            pushToUndo({ index: hintIndex, boardValue: prevBoardValue, draftValues: prevDrafts, type: 'hint' });
            
            board[hintIndex] = solution[hintIndex];
            drafts[hintIndex] = []; // Clear drafts in hinted cell
            
            renderBoard();
            saveGameState();
            checkIfBoardIsFilled();
        }
    }

    function isBoardFilled() {
        return board.every(cellValue => cellValue !== 0);
    }

    function checkIfBoardIsFilled() {
        if (isBoardFilled()) {
            checkAnswer(true); // Pass true to indicate auto-validation
        }
    }

    function showCelebration() {
        clearInterval(timerInterval);
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        finalTimeElement.textContent = `${minutes}:${seconds}`;
        celebrationModal.classList.remove('hidden');
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
        const { index, boardValue, draftValues } = lastMove;

        const currentBoardValue = board[index];
        const currentDraftValues = [...drafts[index]];

        redoStack.push({ index, boardValue: currentBoardValue, draftValues: currentDraftValues });

        board[index] = boardValue;
        drafts[index] = draftValues;
        
        renderBoard();
        updateUndoRedoButtons();
    }

    function redo() {
        if (redoStack.length === 0) return;
        const lastRedo = redoStack.pop();
        const { index, boardValue, draftValues } = lastRedo;

        const currentBoardValue = board[index];
        const currentDraftValues = [...drafts[index]];

        undoStack.push({ index, boardValue: currentBoardValue, draftValues: currentDraftValues });

        board[index] = boardValue;
        drafts[index] = draftValues;

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
            initialBoard,
            solution,
            size,
            difficulty,
            time,
            score,
            undoStack,
            redoStack,
            drafts
        };
        localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
    }

    function loadGameState() {
        const savedState = localStorage.getItem('sudokuGameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            board = gameState.board;
            initialBoard = gameState.initialBoard || [...gameState.board];
            solution = gameState.solution;
            size = gameState.size;
            difficulty = gameState.difficulty;
            time = gameState.time;
            score = gameState.score;
            undoStack = gameState.undoStack || [];
            redoStack = gameState.redoStack || [];
            drafts = gameState.drafts || Array(size * size).fill(null).map(() => []);
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

    complexitySelect.addEventListener('change', () => {
        size = parseInt(complexitySelect.value);
        generateSudoku();
    });

    difficultySelect.addEventListener('change', () => {
        difficulty = difficultySelect.value;
        generateSudoku();
    });

    themeSwitcherBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeSwitcherBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    closeStatsBtn.addEventListener('click', () => statsModal.classList.add('hidden'));
    closeCelebrationModalBtn.addEventListener('click', () => celebrationModal.classList.add('hidden'));
    window.addEventListener('click', (e) => {
        if (e.target === statsModal) {
            statsModal.classList.add('hidden');
        }
        if (e.target === celebrationModal) {
            celebrationModal.classList.add('hidden');
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
            size = 4; // Always start in 4x4
            difficulty = 'hard'; // Always start in hard mode
            complexitySelect.value = size;
            difficultySelect.value = difficulty;
            generateSudoku();
        }
    }

    init();
});
