const BOARD_SIZE = 7;
const TARGET = { row: 3, column: 3 };
const STARTING_PIECES = [
  { id: 1, row: 0, column: 0 },
  { id: 2, row: 6, column: 6 },
];

const board = document.querySelector("#board");
const status = document.querySelector("#game-status");
const moveCount = document.querySelector("#move-count");
const resetButton = document.querySelector("#reset-button");

let pieces;
let selectedPiece;
let moves;
let isWon;

function isAdjacent(piece, row, column) {
  return Math.abs(piece.row - row) + Math.abs(piece.column - column) === 1;
}

function pieceAt(row, column) {
  return pieces.find((piece) => piece.row === row && piece.column === column);
}

function renderBoard() {
  board.replaceChildren();

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const piece = pieceAt(row, column);
      const isTarget = row === TARGET.row && column === TARGET.column;
      const isSelected = selectedPiece !== undefined && piece?.id === selectedPiece;
      const isLegalMove =
        selectedPiece !== undefined &&
        !piece &&
        isAdjacent(pieces.find((item) => item.id === selectedPiece), row, column);
      const cell = document.createElement("button");

      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute(
        "aria-label",
        `Row ${row + 1}, column ${column + 1}${piece ? `, apprentice knight ${piece.id}` : ""}${isTarget ? ", marked summoning circle, feybeast treasure" : ""}${isSelected ? ", selected" : ""}`,
      );
      cell.setAttribute("aria-selected", String(isSelected));
      cell.disabled = isWon;
      if (isSelected) cell.classList.add("cell--selected");
      if (isLegalMove) cell.classList.add("cell--legal");
      if (isTarget) cell.classList.add("cell--target");
      cell.addEventListener("click", () => handleCellClick(row, column));

      if (piece) {
        const marker = document.createElement("span");
        marker.className = `piece piece--${piece.id === 1 ? "one" : "two"}`;
        marker.textContent = piece.id === 1 ? "I" : "II";
        marker.setAttribute("aria-hidden", "true");
        cell.append(marker);
      } else if (isTarget) {
        const marker = document.createElement("span");
        marker.className = "target";
        marker.textContent = "◆";
        marker.setAttribute("aria-hidden", "true");
        cell.append(marker);
      }

      board.append(cell);
    }
  }

  moveCount.textContent = `Moves: ${moves}`;
}

function handleCellClick(row, column) {
  if (isWon) return;

  const piece = pieceAt(row, column);
  if (piece) {
    selectedPiece = piece.id;
    status.textContent = `Knight ${piece.id} selected. Choose an adjacent tile to advance.`;
    renderBoard();
    return;
  }

  const movingPiece = pieces.find((item) => item.id === selectedPiece);
  if (!movingPiece || !isAdjacent(movingPiece, row, column)) {
    status.textContent = "Choose one of the highlighted adjacent tiles to advance.";
    return;
  }

  movingPiece.row = row;
  movingPiece.column = column;
  moves += 1;

  if (row === TARGET.row && column === TARGET.column) {
    isWon = true;
    selectedPiece = undefined;
    status.textContent = `Feybeast treasure captured by Knight ${movingPiece.id} in ${moves} ${moves === 1 ? "move" : "moves"}!`;
  } else {
    status.textContent = `Knight ${movingPiece.id} advances. Select either knight to continue.`;
  }

  renderBoard();
}

function startGame() {
  pieces = STARTING_PIECES.map((piece) => ({ ...piece }));
  selectedPiece = undefined;
  moves = 0;
  isWon = false;
  status.textContent = "Select a knight, then move one tile up, down, left, or right to the marked summoning circle.";
  renderBoard();
}

resetButton.addEventListener("click", startGame);
startGame();
