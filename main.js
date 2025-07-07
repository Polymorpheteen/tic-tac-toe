const Player = (name, marker) => {
  return { name, marker };
};

const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const isFull = () => {
    return board.every((cell) => cell !== "");
  };

  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  return {
    getBoard,
    setMarker,
    resetBoard,
    isFull,
    checkWinner,
  };
})();

const DisplayController = (() => {
  const gameBoard = document.getElementById("gameBoard");
  const currentPlayerDiv = document.getElementById("currentPlayer");
  const gameResultDiv = document.getElementById("gameResult");
  const setupForm = document.getElementById("setupForm");
  const gameArea = document.getElementById("gameArea");

  const renderBoard = () => {
    gameBoard.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((cell, index) => {
      const cellButton = document.createElement("button");
      cellButton.className = "cell";
      cellButton.textContent = cell;
      cellButton.addEventListener("click", () => handleCellClick(index));

      if (cell !== "") {
        cellButton.disabled = true;
      }

      gameBoard.appendChild(cellButton);
    });
  };

  const handleCellClick = (index) => {
    GameController.playTurn(index);
  };

  const updateCurrentPlayer = (player) => {
    currentPlayerDiv.textContent = `Current Player: ${player.name} (${player.marker})`;
  };

  const showResult = (result) => {
    if (result.winner) {
      gameResultDiv.textContent = `${result.winner.name} Wins`;
      gameResultDiv.className = "game-result winner";
    } else if (result.tie) {
      gameResultDiv.textContent = `It's a tie`;
      gameResultDiv.className = "game-result tie";
    }
  };

  const clearResult = () => {
    gameResultDiv.textContent = "";
    gameResultDiv.className = "game-result";
  };

  const showGameArea = () => {
    setupForm.classList.add("hidden");
    gameArea.classList.remove("hidden");
    gameArea.classList.add("fade-in");
  };

  const showSetupForm = () => {
    gameArea.classList.add("hidden");
    setupForm.classList.remove("hidden");
    setupForm.classList.add("fade-in");
  };

  const getPlayerNames = () => {
    const player1Name =
      document.getElementById("player1Name").value.trim() || "Player 1";
    const player2Name =
      document.getElementById("player2Name").value.trim() || "Player 2";
    return { player1Name, player2Name };
  };

  const clearInputs = () => {
    document.getElementById("player1Name").value = "";
    document.getElementById("player2Name").value = "";
  };

  return {
    renderBoard,
    updateCurrentPlayer,
    showResult,
    clearResult,
    showGameArea,
    showSetupForm,
    getPlayerNames,
    clearInputs,
  };
})();

const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameActive = false;

  const startGame = () => {
    const { player1Name, player2Name } = DisplayController.getPlayerNames();

    players = [Player(player1Name, "X"), Player(player2Name, "O")];

    currentPlayerIndex = 0;
    gameActive = true;

    Gameboard.resetBoard();
    DisplayController.clearResult();
    DisplayController.showGameArea();
    DisplayController.renderBoard();
    DisplayController.updateCurrentPlayer(players[currentPlayerIndex]);
  };

  const playTurn = (index) => {
    if (!gameActive) return;

    const currentPlayer = players[currentPlayerIndex];

    if (Gameboard.setMarker(index, currentPlayer.marker)) {
      DisplayController.renderBoard();

      const winner = Gameboard.checkWinner();
      if (winner) {
        const winningPlayer = players.find(
          (player) => player.marker === winner
        );
        DisplayController.showResult({ winner: winningPlayer });
        gameActive = false;
        return;
      }

      if (Gameboard.isFull()) {
        DisplayController.showResult({ tie: true });
        gameActive = false;
        return;
      }

      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      DisplayController.updateCurrentPlayer(players[currentPlayerIndex]);
    }
  };

  const restartGame = () => {
    DisplayController.showSetupForm();
    DisplayController.clearInputs();
    gameActive = false;
  };

  return {
    startGame,
    playTurn,
    restartGame,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  // Add enter key functionality for starting the game
  document.getElementById("player1Name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") GameController.startGame();
  });

  document.getElementById("player2Name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") GameController.startGame();
  });
});
