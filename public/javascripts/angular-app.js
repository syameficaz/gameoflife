'use strict';

angular.module('myApp', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
        var show = false;

        $scope.boardRows = inputrows;
        $scope.boardCols = inputcols;

        var boards = new Array(2);

        var currentBoard = 0;
        var previousBoard = 1;

        boards[currentBoard] = matrix($scope.boardRows, $scope.boardCols, 0);
        boards[previousBoard] = matrix($scope.boardRows, $scope.boardCols, 0);

        $scope.boardHTML = "";
        $scope.message = "";

        $scope.set = function(brows, bcols){
            $scope.boardRows = brows;
            $scope.boardCols = bcols;
        };

        $scope.start = function () {
            if ($scope.counting === true) return false;
            $scope.message = "";
            $scope.generations = 1;
            $scope.counting = true;
            $scope.intervalInstance = setInterval($scope.updateDisplay, 150);
            boards[currentBoard] = randomFillBoard(currentBoard, $scope.boardRows, $scope.boardCols);
            $scope.boardHTML = getBoardHTML(currentBoard, $scope.boardRows, $scope.boardCols);
            $scope.currentBoard = currentBoard;
            show = true;
        };

        $scope.updateDisplay = function () {
            $scope.generations++;

            previousBoard = currentBoard;
            currentBoard = 1 - currentBoard;
            $scope.currentBoard = currentBoard;

            boards[currentBoard] = generateNewBoard(previousBoard, $scope.boardRows, $scope.boardCols);
            $scope.boardHTML = getBoardHTML(currentBoard, $scope.boardRows, $scope.boardCols);

            $scope.counting = false;
            $scope.$apply();

            if (nomorePatterns(currentBoard, previousBoard, $scope.boardRows, $scope.boardCols)) {
                $scope.generations++;
                clearInterval($scope.intervalInstance);
                show = false;
                alert("No more Generations.\n");
                $scope.apply();
            }
        };

        $scope.showButton = function () {
            return show;
        };

        function matrix(rows, cols, defaultValue) {
            var arr = [];
            for (var i = 0; i < rows; i++) {
                arr.push([]);
                arr[i].push(new Array(cols));
                for (var j = 0; j < cols; j++) {
                    arr[i][j] = defaultValue;
                }
            }
            return arr;
        }

        function randomFillBoard(boardnum, rows, cols) {
            var arr = boards[boardnum];
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {

                    arr[i][j] = getRandBinary();
                }
            }
            return arr;
        }

        function generateNewBoard(prevboardnum, rows, cols) {
            var arr = matrix($scope.boardRows, $scope.boardCols, 0);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    arr[i][j] = getNewLifeValue(prevboardnum, i, j, rows, cols);
                }
            }
            return arr;
        }

        function getNewLifeValue(prevboardnum, row, col, rows, cols) {
            var startLifeValue = boards[prevboardnum][row][col];
            var newLifeValue = 0;
            var startrow = (row > 0) ? (row - 1) : row;
            var endrow = (row < (rows - 1)) ? (row + 1) : row;
            var startcol = (col > 0) ? (col - 1) : col;
            var endcol = (col < (cols - 1)) ? (col + 1) : col;
            var liveNeighbors = 0;
            for (var i = startrow; i <= endrow; i++) {
                for (var j = startcol; j <= endcol; j++) {
                    if ((i == row) && (j == col)) {
                    } else {
                        liveNeighbors += boards[prevboardnum][i][j];
                    }
                }
            }

            if (startLifeValue == 0) {
                newLifeValue = 0;
                if (liveNeighbors == 3) newLifeValue = 1;
            } else {
                newLifeValue = 0;
                if ((liveNeighbors == 2) || (liveNeighbors == 3)) newLifeValue = 1;
            }
            return newLifeValue;
        }


        function getRandBinary() {
            return Math.floor(Math.random() * 2);
        }

        function nomorePatterns(current, previous, rows, cols) {
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
    }]);