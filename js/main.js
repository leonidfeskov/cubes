(function(){
    'use strict';

    var CELL_SIZE = 30;
    var DIVIATION = Math.round(CELL_SIZE / 5);
    var COLOR_GRID = '#EEEEEE';
    var COLOR_STROKE = '#212121';

    var width = window.innerWidth;
    var height = window.innerHeight;

    var cellsCountByX = Math.floor(width / CELL_SIZE) + 1;
    var cellsCountByY = Math.floor(height / CELL_SIZE) + 1;

    var canvasGrid = document.getElementById('cubes-grid');
    var canvas = document.getElementById('cubes-canvas');
    var buttonClearAll = document.querySelector('.js-clear-all');
    var buttonSaveImage = document.querySelector('.js-save-image');
    var consoleNode = document.querySelector('.js-console');

    var Cell = function() {
        return {
            top: null,
            left: null,
            diagonal: null
        };
    };

    var Notebook = function() {
        this.data = [];

        // создаем пустой
        this.createEmptyNotebook = function() {
            for (var i = 0; i < cellsCountByY; i++) {
                this.data[i] = [];
                for (var j = 0; j < cellsCountByX; j++) {
                    this.data[i][j] = new Cell();
                }
            }
        }

        this.syncWithStorage = function() {
            localStorage.setItem('notebookData', JSON.stringify(this.data));
        };

        this.addStroke = function(cellCoords, strokeType) {
            var x = cellCoords.x;
            var y = cellCoords.y;

            if (!this.data[y][x][strokeType]) {
                this.data[y][x][strokeType] = true;
                this.syncWithStorage();
                drawStroke(cellCoords, strokeType);
            }

        };

        this.removeCell = function(cellCoords) {
            var x = cellCoords.x;
            var y = cellCoords.y;

            this.data[y][x] = new Cell();
            this.data[y + 1][x].top = null;
            this.data[y][x + 1].left = null;

            this.syncWithStorage();

            clearCell(cellCoords);
        };
    };

    var notebook = new Notebook();

    var ctxGrid = canvasGrid.getContext('2d');
    var ctx = canvas.getContext('2d');

    canvas.width = canvasGrid.width = width;
    canvas.height = canvasGrid.height = height;

    ctxGrid.strokeStyle = COLOR_GRID;
    ctx.strokeStyle = COLOR_STROKE;

    // рисуем сетку на нижнем холсте
    (function drawGrid() {
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
    })();

    function getCellCoords(x, y) {
        return {
            x: Math.floor(x / CELL_SIZE),
            y: Math.floor(y / CELL_SIZE)
        }
    }

    function drawStroke(cellCoords, strokeType) {
        ctx.beginPath();

        switch (strokeType) {
            case 'top':
                ctx.moveTo(CELL_SIZE * cellCoords.x, CELL_SIZE * cellCoords.y);
                ctx.lineTo(CELL_SIZE * (cellCoords.x + 1), CELL_SIZE * cellCoords.y);
                break;
            case 'left':
                ctx.moveTo(CELL_SIZE * cellCoords.x, CELL_SIZE * cellCoords.y);
                ctx.lineTo(CELL_SIZE * cellCoords.x, CELL_SIZE * (cellCoords.y + 1));
                break;
            case 'diagonal':
                ctx.moveTo(CELL_SIZE * cellCoords.x, CELL_SIZE * (cellCoords.y + 1));
                ctx.lineTo(CELL_SIZE * (cellCoords.x + 1), CELL_SIZE * cellCoords.y);
                break;
            default:
                break;
        }
        
        ctx.closePath();
        ctx.stroke();
    }

    function clearCell(cellCoords) {
        var cellPositionX = cellCoords.x * CELL_SIZE;
        var cellPositionY = cellCoords.y * CELL_SIZE;

        ctx.clearRect(cellPositionX - 1, cellPositionY - 1, CELL_SIZE + 2, CELL_SIZE + 2);
    }

    function drawFromStorage() {
        notebook.data = JSON.parse(localStorage.getItem('notebookData'));

        for (var i = 0; i < notebook.data.length; i++) {
            var row = notebook.data[i];
            for (var j = 0; j < row.length; j++) {
                var cell = row[j];
                var cellCoords = {
                    x: j,
                    y: i
                };
                if (cell.top) {
                    drawStroke(cellCoords, 'top');
                }
                if (cell.left) {
                    drawStroke(cellCoords, 'left');
                }
                if (cell.diagonal) {
                    drawStroke(cellCoords, 'diagonal');
                }
            }
        }
    }

    // Если что-то уже есть в localStorage, рисуем оттуда
    if (localStorage.getItem('notebookData')) {
        drawFromStorage();
    } else {
        notebook.createEmptyNotebook();
    }

    var currentCell = {};
    var isDrawProcess = false;

    canvas.addEventListener('mousedown', function(event) {
        isDrawProcess = true;

        var x = event.clientX;
        var y = event.clientY;

        var cellCoords = getCellCoords(x, y);

        // координаты клика относительно текущей ячейки
        // по ним определяем какую именно сторону ячейки пользователь хочет нарисовать
        var distanceToTop = y - (cellCoords.y * CELL_SIZE);
        var distanceToBottom = ((cellCoords.y + 1) * CELL_SIZE) - y;
        var distanceToLeft = x - (cellCoords.x * CELL_SIZE);
        var distanceToRight = ((cellCoords.x + 1) * CELL_SIZE) - x;

        // стираем всю клетку
        if (event.altKey) {
            notebook.removeCell(cellCoords);
            return;
        }

        // рисуем необходимую линиию в зависимости от того к какой стороне ячейки кликнули ближе
        if (distanceToTop <= DIVIATION && distanceToTop <= distanceToLeft && distanceToTop < distanceToRight) {
            notebook.addStroke(cellCoords, 'top');
            currentCell.strokeType = 'top';
        }
        else if (distanceToRight <= DIVIATION && distanceToRight <= distanceToTop && distanceToRight < distanceToBottom) {
            cellCoords.x += 1;
            notebook.addStroke(cellCoords, 'left');
            currentCell.strokeType = 'left';
        }
        else if (distanceToBottom <= DIVIATION && distanceToBottom <= distanceToRight && distanceToBottom < distanceToLeft) {
            cellCoords.y += 1;
            notebook.addStroke(cellCoords, 'top');
            currentCell.strokeType = 'top';
        }
        else if (distanceToLeft <= DIVIATION && distanceToLeft <= distanceToBottom && distanceToLeft < distanceToTop) {
            notebook.addStroke(cellCoords, 'left');
            currentCell.strokeType = 'left';
        }
        else {
            notebook.addStroke(cellCoords, 'diagonal');
            currentCell.strokeType = 'diagonal';
        }

        // запоминаем информацию о ячейке, в которой произошло событие mousedown
        // необходимо для рисования длинных линии по протягиванию мыши
        currentCell.coords = {
            x: cellCoords.x,
            y: cellCoords.y
        }
    });

    canvas.addEventListener('mousemove', function(event) {
        if (isDrawProcess) {
            var x = event.clientX;
            var y = event.clientY;

            var cellCoords = getCellCoords(x, y);
            var cell = notebook.data[cellCoords.y][cellCoords.x];

            // стираем всю клетку
            if (event.altKey) {
                notebook.removeCell(cellCoords);
                return;
            }

            switch (currentCell.strokeType) {
                case 'top':
                    if (!cell.top) {
                        cellCoords.y = currentCell.coords.y;
                        notebook.addStroke(cellCoords, 'top');
                    }
                    break;
                case 'left':
                    if (!cell.left) {
                        cellCoords.x = currentCell.coords.x;
                        notebook.addStroke(cellCoords, 'left');
                    }
                    break;
                case 'diagonal':
                    if (!cell.diagonal) {
                        var deltaX = cellCoords.x - currentCell.coords.x;
                        var deltaY = cellCoords.y - currentCell.coords.y;

                        if (deltaX > 0 && deltaY < 0) {
                            cellCoords.x = currentCell.coords.x - Math.min(deltaX, deltaY);
                            cellCoords.y = currentCell.coords.y + Math.min(deltaX, deltaY);
                            notebook.addStroke(cellCoords, 'diagonal');
                        }

                        if (deltaX < 0 && deltaY > 0) {
                            cellCoords.x = currentCell.coords.x + Math.min(deltaX, deltaY);
                            cellCoords.y = currentCell.coords.y - Math.min(deltaX, deltaY);
                            notebook.addStroke(cellCoords, 'diagonal');
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    });

    document.addEventListener('mouseup', function() {
        isDrawProcess = false;
    });

    buttonClearAll.addEventListener('click', function() {
        ctx.clearRect(0, 0, width, height);
        localStorage.clear();
        notebook.createEmptyNotebook();
    });

    buttonSaveImage.addEventListener('click', function() {
        var dataURL = canvas.toDataURL();
        window.open(dataURL);
    });

})();