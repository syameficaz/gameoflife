'use strict';

var boardSize = 20; // try values from 30-50
var boardSize1 = 30; // try values from 30-50
var delayMs = 150; // delay between displays (ticks)

var generations = 0; // counter of generations (ticks)

// create array of 2 boards
var boards = new Array(2);
// point to current board
var currentBoard = 0; // (0 or 1)
var previousBoard = 1; // (1 or 0)
// create empty boards, defaulted to all zeroes
boards[0] = matrix(boardSize, boardSize1, 0);
boards[1] = matrix(boardSize, boardSize1, 0);

var App = angular.module('myApp', []);

angular.module('myApp', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
        var show = false;
        $scope.boardSize = boardSize;
        $scope.boardSize1 = boardSize1;
        $scope.delayMs = delayMs;
        $scope.boardHTML = "";
        $scope.message = "";

        $scope.on = function (boardSize, boardSize1) {
            if ($scope.counting === true) return false;
            $scope.message = "";
            $scope.generations = 1;
            $scope.counting = true;
            $scope.intervalInstance = setInterval($scope.updateDisplay, 150);
            // fill intial board with random values
            boards[currentBoard] = randomFillBoard(currentBoard, $scope.boardSize, $scope.boardSize1);
            $scope.boardHTML = getBoardHTML(currentBoard, $scope.boardSize, $scope.boardSize1);
            $scope.currentBoard = currentBoard;
            show = true;
        }

        $scope.off = function () {
            show = false;
            clearInterval($scope.intervalInstance);
            alert("Stopping! \nClick START to go again.");
        }

        $scope.updateDisplay = function () {
            $scope.generations++;

            // get new board
            // -- save currentBoard number, get new currentBoard number
            previousBoard = currentBoard;
            currentBoard = 1 - currentBoard;
            $scope.currentBoard = currentBoard;
            // now we are pointing to board to be filled
            boards[currentBoard] = generateNewBoard(previousBoard, $scope.boardSize, $scope.boardSize1);
            $scope.boardHTML = getBoardHTML(currentBoard, $scope.boardSize, $scope.boardSize1);

            $scope.counting = false;
            $scope.$apply();
            // compare to previous board
            // if SAME, STOP with special message
            if (boardsTheSame(currentBoard, previousBoard, $scope.boardSize, $scope.boardSize1)) {
                $scope.generations++;
                clearInterval($scope.intervalInstance);
                show = false;
                alert("HEY! NEXT BOARD IS THE SAME!\nClick STOP.\n");
                $scope.apply();
            }
        }


        $scope.showButton = function () {
            return show;
        }
    }]);

function matrix(rows, cols, defaultValue) {
    var arr = [];
    // Creates all lines:
    for (var i = 0; i < rows; i++) {
        // Creates an empty line
        arr.push([]);
        // Adds cols to the empty line:
        arr[i].push(new Array(cols));
        for (var j = 0; j < cols; j++) {
            // Initializes:
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}

function randomFillBoard(boardnum, rows, cols) {
    var arr = boards[boardnum];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            // Initializes:
            arr[i][j] = getRandBinary();
        }
    }
    return arr;
}

function generateNewBoard(prevboardnum, rows, cols) {

    var arr = matrix(boardSize, boardSize, 0);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            // Set each cell
            arr[i][j] = getNewLifeValue(prevboardnum, i, j, rows, cols);
        }
    }
    return arr;

}

function getNewLifeValue(prevboardnum, row, col, rows, cols) {
    // save current life value
    var startLifeValue = boards[prevboardnum][row][col];
    var newLifeValue = 0;

    // check all surrounding squares
    var startrow = (row > 0) ? (row - 1) : row;
    var endrow = (row < (rows - 1)) ? (row + 1) : row;
    var startcol = (col > 0) ? (col - 1) : col;
    var endcol = (col < (cols - 1)) ? (col + 1) : col;
    var liveNeighbors = 0;
    for (var i = startrow; i <= endrow; i++) {
        for (var j = startcol; j <= endcol; j++) {
            // skip the current space itself
            if ((i == row) && (j == col)) {
                // skip
            } else {
                liveNeighbors += boards[prevboardnum][i][j];
            }
        }
    }

    if (startLifeValue == 0) {
        // if currently DEAD, only ONE check
        newLifeValue = 0;
        if (liveNeighbors == 3) newLifeValue = 1;
    } else {
        // WAS alive; only lives on if 2 or 3 live neighbors
        newLifeValue = 0;
        if ((liveNeighbors == 2) || (liveNeighbors == 3)) newLifeValue = 1;
    }

    return newLifeValue;
}


function getRandBinary() {
    return Math.floor(Math.random() * 2);
}

function boardsTheSame(current, previous, rows, cols) {
    var diffs = 0;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (boards[current][i][j] != boards[previous][i][j]) {
                diffs++;
            }
        }
    }
    return (diffs == 0) ? true : false;
}


function getBoardHTML(boardnum, rows, cols) {
    var boardHTML = "";
    var arr = boards[boardnum];

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var code = "<span class='cell ";
            code += (arr[i][j] == 0) ? "dead" : "alive";
            code += "'></span>";
            boardHTML += code;
        }
        boardHTML += "</br>\n";
    }
    return boardHTML;
}