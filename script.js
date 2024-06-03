document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById('game-board');

  const pieces = {
    TANK: 'K',
    TITAN: 'T',
    BULLET: 'B',
    CANNON: 'C'
  };

  const initialBoard = [
    ["T", "", "C", "", "", "K", "", "T"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ];

  let currentPlayer = 1; // Player 1 starts
  let selectedPiece = null;
  let cannonPosition = { row: 0, col: 0 };

  function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', () => handleCellClick(row, col));
        board.appendChild(cell);
      }
    }
  }

  function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      const row = cell.dataset.row;
      const col = cell.dataset.col;
      cell.textContent = initialBoard[row][col];
      cell.classList.remove('highlight');
      if (initialBoard[row][col] === pieces.TANK) {
        cell.classList.add('tank');
      } else if (initialBoard[row][col] === pieces.TITAN) {
        cell.classList.add('titan');
      } else if (initialBoard[row][col] === pieces.BULLET) {
        cell.classList.add('bullet');
      } else if (initialBoard[row][col] === pieces.CANNON) {
        cell.classList.add('cannon');
      }
    });
  }

  function handleCellClick(row, col) {
    if (selectedPiece) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
      selectedPiece = null;
      clearHighlights();
    } else if ((initialBoard[row][col] === pieces.TANK || initialBoard[row][col] === pieces.TITAN) && getPlayer(row, col) === currentPlayer) {
      selectedPiece = { row, col };
      highlightPossibleMoves(row, col);
    }
  }

  function movePiece(row, col, newRow, newCol) {
    if (isValidMove(row, col, newRow, newCol)) {
      initialBoard[newRow][newCol] = initialBoard[row][col];
      initialBoard[row][col] = '';
      renderBoard();
      checkBulletCollision();
      switchPlayer();
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }

  function getPlayer(row, col) {
    return initialBoard[row][col] === pieces.TANK || initialBoard[row][col] === pieces.TITAN ? 1 : 2;
  }

  function isValidMove(row, col, newRow, newCol) {
    const rowDiff = Math.abs(newRow - row);
    const colDiff = Math.abs(newCol - col);

    // Tank and Titan can move one tile in any direction (vertically, horizontally, or diagonally)
    return rowDiff <= 1 && colDiff <= 1 && initialBoard[newRow][newCol] === '';
  }

  function highlightPossibleMoves(row, col) {
    const directions = [
      { row: -1, col: 0 },   // Up
      { row: 1, col: 0 },    // Down
      { row: 0, col: -1 },   // Left
      { row: 0, col: 1 },    // Right
      { row: -1, col: -1 },  // Up-Left
      { row: -1, col: 1 },   // Up-Right
      { row: 1, col: -1 },   // Down-Left
      { row: 1, col: 1 }     // Down-Right
    ];

    directions.forEach(direction => {
      const newRow = row + direction.row;
      const newCol = col + direction.col;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && initialBoard[newRow][newCol] === '') {
        const cell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
        if (cell) {
          cell.classList.add('highlight');
        }
      }
    });
  }

  function clearHighlights() {
    const highlightedCells = document.querySelectorAll('.highlight');
    highlightedCells.forEach(cell => cell.classList.remove('highlight'));
  }

  function fireBullet() {
    const bulletRow = cannonPosition.row - 1;
    if (bulletRow >= 0) {
      initialBoard[bulletRow][cannonPosition.col] = pieces.BULLET;
      renderBoard();
      cannonPosition = { row: bulletRow, col: cannonPosition.col };
      setTimeout(fireBullet, 1000); // Move the bullet every second
    }
  }

  function checkBulletCollision() {
    const bulletRow = cannonPosition.row - 1;
    if (bulletRow >= 0) {
      const pieceInFront = initialBoard[bulletRow][cannonPosition.col];
      if (pieceInFront === pieces.TANK || pieceInFront === pieces.TITAN) {
        // Hit the tank or titan, handle collision logic
        initialBoard[bulletRow][cannonPosition.col] = ''; // Remove the tank or titan
        initialBoard[cannonPosition.row][cannonPosition.col] = ''; // Remove the bullet
        renderBoard();
        // Implement additional logic as needed
      }
    }
  }

  // Place the cannon at the base rank
  function placeCannon() {
    initialBoard[cannonPosition.row][cannonPosition.col] = pieces.CANNON;
    renderBoard();
  }

  // Initial setup
  placeCannon();
  createBoard();
  renderBoard();
});
