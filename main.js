const Gameboard = (() => {
  let board = Array(9).fill(null);

  // it returns the copy of the board
  const getBoard = () => board.slice();

  const setCell = (index, marker) => {
    if (board[index] === null) {
      board[index] === marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = Array(9).fill(null);
  };

  return { getBoard, setCell, reset };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const DisplayController = (() => {
  const gameBoardDiv = document.querySelector(".gameboard");
  const startBtn = document.getElementById("start-btn");
  let cellClickHandler = null;

  const renderBoard = (board) => {
    gameBoardDiv.innerHTML = "";
    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell ? cell : "";
      cellDiv.dataset.index = index;
      if (cellClickHandler) {
        cellDiv.addEventListener("click", () => cellClickHandler(index));
      }
      gameBoardDiv.appendChild(cellDiv);
    });
  };

  const setCellClickHandler = (handler) => {
    cellClickHandler = handler;
  };

  const hideStartButton = () => {
    startBtn.style.display = "none";
  };

  return { renderBoard, setCellClickHandler, hideStartButton };
})();

const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameActive = false;

  const startGame = (player1, player2) => {
    players = [player1, player2];
    currentPlayerIndex = 0;
    gameActive = true;
    Gameboard.reset();
    DisplayController.hideStartButton();
    DisplayController.setCellClickHandler(handleCellClick);
    DisplayController.renderBoard(Gameboard.getBoard());
  };

  const handleCellClick = (index) => {
    if (!gameActive) return;

    if (Gameboard.setCell(index, players[currentPlayerIndex].marker)) {
      DisplayController.renderBoard(Gameboard.getBoard());

      if (checkWin(players[currentPlayerIndex].marker)) {
        alert(`${players[currentPlayerIndex].name} wins!`);
        gameActive = false;
      } else if (checkTie()) {
        alert("Tie game!");
        gameActive = false;
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex;
      }
    }
  };

  const checkWin = (marker) => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winPatterns.some((pattern) => pattern.every((i) => b[i] === marker));
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== null);
  };

  return { startGame };
})();

const playerModal = document.getElementById("player-modal");
const playerForm = document.getElementById("player-form");
const startBtn = document.getElementById("start-btn");

let player1;
let player2;

playerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name1 = document.getElementById("player1").value || "Player 1";
  const name2 = document.getElementById("player2").value || "Player 2";

  player1 = Player(name1, "X");
  player2 = Player(name2, "O");

  playerModal.style.display = "none"; // hide modal
  startBtn.style.display = "none"; // hide fallback button
  GameController.startGame(player1, player2); // start game with input players
});

// Optional: Open modal when clicking fallback button
startBtn.addEventListener("click", () => {
  playerModal.style.display = "flex";
});
