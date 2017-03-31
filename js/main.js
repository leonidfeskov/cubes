(function(){
    'use strict';

    var CELL_SIZE = 30;
    var DIVIATION = Math.round(CELL_SIZE / 5);
    var COLOR_GRID = '#EEEEEE';
    var COLOR_STROKE = '#212121';


    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvasGrid = document.getElementById('cubes-grid');
    var ctxGrid = canvasGrid.getContext('2d');

    var canvas = document.getElementById('cubes-canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = canvasGrid.width = width;
    canvas.height = canvasGrid.height = height;

    ctxGrid.strokeStyle = COLOR_GRID;
    ctx.strokeStyle = COLOR_STROKE;

    var cellsCountByX = Math.floor(width / CELL_SIZE) + 1;
    var cellsCountByY = Math.floor(height / CELL_SIZE) + 2;


    // Здесь храним рисунок
    // userImage.cells - двумерный массив всех клеток. Каждая клетка содержит в себе информацию о нарисованном штрихе
    // Чтобы общая грань двух соседних клеток не рисовалась дважды, рисуем только левую, верхнюю и диагональную линии для каждой клетки
    var userImage;
    if (localStorage.getItem('userImage')) {
        drawFromStorage();
    } else {
        createEmptyUserImage();
    }

    function createEmptyUserImage() {
        userImage = {
            cells: []
        };

        for (var i = 0; i < cellsCountByY; i++) {
            userImage.cells[i] = [];
            for (var j = 0; j < cellsCountByX; j++) {
                userImage.cells[i][j] = null;
            }
        }
    }

    // рисуем сетку
    function drawGrid() {
        // горизонтальные линии
        ctxGrid.beginPath();
        var i = 0;
        while (CELL_SIZE * i <= height) {
            ctxGrid.moveTo(0, CELL_SIZE * i);
            ctxGrid.lineTo(width, CELL_SIZE * i);
            i++;
        }

        // вертикальные линии
        var j = 0;
        while (CELL_SIZE * j <= width) {
            ctxGrid.moveTo(CELL_SIZE * j, 0);
            ctxGrid.lineTo(CELL_SIZE * j, height);
            j++;
        }
        ctxGrid.closePath();
        ctxGrid.stroke();
    }

    drawGrid();

    function getCellNumber(x, y) {
        var posX = Math.floor(x / CELL_SIZE);
        var posY = Math.floor(y / CELL_SIZE);
        return {
            x: posX,
            y: posY,
            coordX: posX * CELL_SIZE,
            coordY: posY * CELL_SIZE
        }
    }

    function addStrokeToStorage(cellNumber, strokeName) {
        var cell = userImage.cells[cellNumber.y][cellNumber.x];
        if (cell === null) {
            userImage.cells[cellNumber.y][cellNumber.x] = {};
        }
        userImage.cells[cellNumber.y][cellNumber.x][strokeName] = true;

        localStorage.setItem('userImage', JSON.stringify(userImage));
    }

    function clearCellInStorage(cellNumber) {
        userImage.cells[cellNumber.y][cellNumber.x] = null;
        var siblingRightCell = userImage.cells[cellNumber.y][cellNumber.x + 1];
        var siblingBottomCell = userImage.cells[cellNumber.y + 1][cellNumber.x];

        if (siblingRightCell !== null) {
            delete userImage.cells[cellNumber.y][cellNumber.x + 1].left;
            if (!siblingRightCell.top && !siblingRightCell.diagonal) {
                userImage.cells[cellNumber.y][cellNumber.x + 1] = null;
            }
        }

        if (siblingBottomCell !== null) {
            delete userImage.cells[cellNumber.y + 1][cellNumber.x].top;
            if (!siblingBottomCell.left && !siblingBottomCell.diagonal) {
                userImage.cells[cellNumber.y + 1][cellNumber.x] = null;
            }
        }

        localStorage.setItem('userImage', JSON.stringify(userImage));
    }

    function drawDiagonal(cellNumber, save) {
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE * cellNumber.x, CELL_SIZE * (cellNumber.y + 1));
        ctx.lineTo(CELL_SIZE * (cellNumber.x + 1), CELL_SIZE * cellNumber.y);
        ctx.closePath();
        ctx.stroke();
        if (save) {
            addStrokeToStorage(cellNumber, 'diagonal');
        }
    }

    function drawTop(cellNumber, save) {
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE * cellNumber.x, CELL_SIZE * cellNumber.y);
        ctx.lineTo(CELL_SIZE * (cellNumber.x + 1), CELL_SIZE * cellNumber.y);
        ctx.closePath();
        ctx.stroke();
        if (save) {
            addStrokeToStorage(cellNumber, 'top');
        }
    }

    function drawLeft(cellNumber, save) {
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE * cellNumber.x, CELL_SIZE * cellNumber.y);
        ctx.lineTo(CELL_SIZE * cellNumber.x, CELL_SIZE * (cellNumber.y + 1));
        ctx.closePath();
        ctx.stroke();
        if (save) {
            addStrokeToStorage(cellNumber, 'left');
        }
    }

    function clearCell(cellNumber) {
        ctx.clearRect(cellNumber.coordX - 1, cellNumber.coordY - 1, CELL_SIZE + 2, CELL_SIZE + 2);
        clearCellInStorage(cellNumber);
    }

    function drawFromStorage () {
        userImage = JSON.parse(localStorage.getItem('userImage'));
        for (var i = 0; i < userImage.cells.length; i++) {
            var row = userImage.cells[i];
            for (var j = 0; j < row.length; j++) {
                var cell = row[j];
                var cellNumber = {
                    x: j,
                    y: i,
                    coordX: j * CELL_SIZE,
                    coordY: i * CELL_SIZE
                };
                if (cell === null) {
                    continue;
                }
                if (cell.left) {
                    drawLeft(cellNumber, false);
                }
                if (cell.top) {
                    drawTop(cellNumber, false);
                }
                if (cell.diagonal) {
                    drawDiagonal(cellNumber, false);
                }
            }
        }

    }

    canvas.addEventListener('click', function(event) {
        var x = event.clientX;
        var y = event.clientY;

        var cellNumber = getCellNumber(x, y);

        // координаты клика относительно текущей ячейки
        var deltaX = x - cellNumber.coordX;
        var deltaY = y - cellNumber.coordY;

        if (event.altKey) {
            clearCell(cellNumber);
            return;
        }

        if (deltaX <= DIVIATION) {
            drawLeft(cellNumber, true);
        } else if (deltaY <= DIVIATION) {
            drawTop(cellNumber, true);
        } else if (deltaX >= CELL_SIZE - DIVIATION) {
            cellNumber.x += 1;
            cellNumber.coordX += CELL_SIZE;
            drawLeft(cellNumber, true);
        } else if (deltaY >= CELL_SIZE - DIVIATION) {
            cellNumber.y += 1;
            cellNumber.coordY += CELL_SIZE;
            drawTop(cellNumber, true);
        } else {
            drawDiagonal(cellNumber, true);
        }
    });

    var buttonClearAll = document.querySelector('.js-clear-all');
    var buttonSaveImage = document.querySelector('.js-save-image');

    buttonClearAll.addEventListener('click', function() {
        ctx.clearRect(0, 0, width, height);
        localStorage.clear();
        createEmptyUserImage();
    });

    buttonSaveImage.addEventListener('click', function() {
        var dataURL = canvas.toDataURL();
        window.open(dataURL);
    });
})();