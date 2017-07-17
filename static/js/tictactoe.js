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
		for (var i = 0; i < winningConditions.length; i++) {

			var token1 = board[winningConditions[i][0]]
			var token2 = board[winningConditions[i][1]]
			var token3 = board[winningConditions[i][2]]

	    // win condition met
	    if (token1 === token2 && token1 === token3) {
	    	if (token1 == aiToken) {
	    		return "AI_WINS"
	    	} else if (token1 == humanToken) {
	    		return "HUMAN_WINS"
	    	}

	    }

	}

	  // If no win, and no draw.
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

		if (board[cell.id] == "_") {
			$(cell).html(humanToken)
			board[cell.id] = humanToken
		}

	  // Check if win condition met
	  if (checkForWin(board) == "HUMAN_WINS") {
	  	setTimeout(function () {
	  		alert ("You won the game against the AI!");
	  		resetGame();
	  	}, 400)

	  } else if (checkForWin(board) == "AI_WINS") {
	  	setTimeout(function () {
	  		alert ("You lost, please try again...");
	  		resetGame();
	  	}, 400)
	  } else if (round >= 9) {
	  	setTimeout(function () {
	  		alert ("You drew against the AI.");
	  		resetGame();
	  	}, 400)
	  } else {
	  	var index = getBestMove(board)
	  	var selector = "#" + index;
	  	$(selector).html(aiToken);
	  	board[index] = aiToken;

	  }

	}

	function minimax(board, depth, isMaximizer) {
		var availableSpotsArray = getAvailableSpots(board)

		if (checkForWin(board) == "AI_WINS") {
			return 10 - depth;
		} else if (checkForWin(board) == "HUMAN_WINS"){
			return depth -10;
		} else if (availableSpotsArray.length == 0) {
	    // Game draw, return 0
	    return 0;
	}

	if (isMaximizer) {
		var bestScore = -10000;

	    // Go through all empty cells
	    for (var i=0; i < board.length; i++) {
	    	var boardCopy = board.slice()
	    	if (boardCopy[i] == "_") {

	    		boardCopy[i] = aiToken;

	    		bestScore = Math.max(bestScore, minimax(boardCopy, depth+1, false))

	    		boardCopy[i] = "_"

	    	}
	    }

	    return bestScore;

	} else {

		var bestScore = 10000;

	    // Go through all empty cells
	    for (var i=0; i < board.length; i++) {
	    	var boardCopy = board.slice()
	    	if (boardCopy[i] == "_") {

	    		boardCopy[i] = humanToken;

	    		bestScore = Math.min(bestScore, minimax(boardCopy, depth+1, true))

	    		boardCopy[i] = "_"
	    	}
	    }

	    return bestScore;

	}

	}

	function getBestMove(board) {

		var highestValue = -1000
		var bestMove = null;

		for (var i=0; i < board.length; i++) {
			var boardCopy = board.slice()
			if (boardCopy[i] == "_") {

				boardCopy[i] = humanToken;

				moveValue = minimax(boardCopy, 0, false)

				boardCopy[i] = "_"

				if (moveValue > highestValue) {
					bestMove = i;
				}
			}
		}

		return bestMove

	}