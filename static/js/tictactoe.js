
// Board
// 0 1 2
// 3 4 5
// 6 7 8

$(document).ready(function() {
  var clickDisabled = false;
  var cellClickDisabled = true;
  $(".selectX").click(function() {
    if (!clickDisabled) {
      $(".selectX h2").css("text-decoration", "underline");
      humanToken = "X";
      aiToken = "O";
      console.log("aiToken" + " " + aiToken)
      clickDisabled = true;
      cellClickDisabled = false;
    }
  });
  $(".selectO").click(function() {
    if (!clickDisabled) {
      $(".selectO h2").css("text-decoration", "underline");
      humanToken = "O";
      aiToken = "X";
      console.log("aiToken" + " " + aiToken)
      clickDisabled = true;
      cellClickDisabled = false;
    }
  });

  $("td").click(function() {
    if (!cellClickDisabled) {
      turn = humanToken
      handleClick(this);
      console.log("clicked");
    }
  });
});

var board = [
             "_", "_", "_",
             "_", "_", "_",
             "_", "_", "_"
            ]
var winningConditions = [
    [0, 1, 2 ], [3, 4 ,5], [6, 7 ,8],
    [0, 3, 6], [1, 4, 7], [2, 5 ,8],
    [0, 4, 8], [6, 7, 8]
]

var turn;

var round = 0;
var humanToken;
var aiToken;
var iter = 0;

// token1 = "X"
// token2 = "O"

// Check if current board matches with winning condition
function checkForWin(board) {
  console.log("checking for win")
	for (var i = 0; i < winningConditions.length; i++) {

		var token1 = board[winningConditions[i][0]]
		var token2 = board[winningConditions[i][1]]
		var token3 = board[winningConditions[i][2]]

    // win condition met
		if ((token1 !== "_") && token1 === token2 && token1 === token3) {
      console.log("game won!")
      return true;
      
		}

  }

	// If no win, and no draw.
  console.log ("nothing changed")
	return false;
}

function resetGame() {
  round = 0;
  board = [
             "_", "_", "_",
             "_", "_", "_",
             "_", "_", "_"
  ]
  $("td").html("");
  $(".selectX h2").css("text-decoration", "none");
  $(".selectO h2").css("text-decoration", "none");
}

// Obtain remaining available spots in an array
function getAvailableSpots(board) {
  var availableSpotsArray = [];

  for (var i = 0; i < board.length; i++) {
    if (board[i] == "_") {
      availableSpotsArray.push(i);
    }
  }
  return availableSpotsArray;
}

function handleClick(cell) {
  console.log("element"+ cell.id);

  if (board[cell.id] == "_") {
    round++
    console.log(cell)
    console.log($(cell).value)
    $(cell).html(humanToken)
    board[cell.id] = humanToken
    console.log("printing the board: ")
    console.log(board)
    console.log("printing the round: ")
    console.log(round)
  }

  // Check if win condition met
  if (checkForWin(board) == true) {
    if (turn == humanToken) {
      setTimeout(function () {
        alert ("You won the game against the AI!");
        resetGame();
      }, 400)
    } else if (turn == aiToken) {
      setTimeout(function () {
        alert ("You lost, please try again...");
        resetGame();
      }, 400)
    } else if (round >= 9) {
      setTimeout(function () {
        alert ("You drew against the AI.");
        resetGame();
      }, 400)
    }

  } else {
    round++;
    var index = getBestMove(board)
    var selector = "#" + index;
    $(selector).html(aiToken);
    board[index] = aiToken;

  // console.log(board);
  // console.log(index);
  // if (checkForWin(board) == true) {
  //   if (turn == aiToken) {
  //     setTimeout(function () {
  //       alert ("You lost, please try again...");
  //       resetGame();
  //     }, 400)
  //   } else if (round >= 9) {
  //     setTimeout(function () {
  //       alert ("You drew against the AI.");
  //       resetGame();
  //     }, 400)
  //   }

  // }

  }

}

function minimax(board, depth, isMaximizer) {
  var availableSpotsArray = getAvailableSpots(board)

  if (checkForWin(board)) {
    if (turn == aiToken) {
      return 10;
    } else {
      return -10;
    }
  } else if (availableSpotsArray.length == 0) {
    console.log("empty available spots")
    // Game draw, return 0
    return 0;
  }

  if (isMaximizer) {
    var bestScore = -1000;

    // Go through all empty cells
    for (var i=0; i < board.length; i++) {
      if (board[i] == "_") {

        board[i] = aiToken;

        turn = aiToken
        bestScore = Math.max(bestScore, minimax(board, depth+1, false))

        board[i] = "_"

      }
    }
    console.log("Logging Best Score ++++")
    console.log(bestScore)
    return bestScore;

  } else {

    var bestScore = 1000;

    // Go through all empty cells
    for (var i=0; i < board.length; i++) {
      if (board[i] == "_") {

        board[i] = humanToken;

        turn = humanToken
        bestScore = Math.min(bestScore, minimax(board, depth+1, true))

        board[i] = "_"
      }
    }

    return bestScore;

  }

}

function getBestMove(board) {

  var highestValue = -1000
  var bestMove = null;

  for (var i=0; i < board.length; i++) {
    if (board[i] == "_") {

      board[i] = aiToken;

      turn = humanToken
      moveValue = minimax(board, 0, false)

      board[i] = "_"

      if (moveValue > highestValue) {
        bestMove = i;
      }
    }
  }

  return bestMove

}

