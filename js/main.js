(function(){
    'use strict';

    var CELL_SIZE = 30;
    var VERTICAL_CELLS_COUNT = 40;
    var DIVIATION = Math.round(CELL_SIZE / 5);
    var COLOR_GRID = '#EEEEEE';
    var COLOR_STROKE = '#212121';

    var MODE_DRAW = 'draw';
    var MODE_PICK = 'pick';

    var targetCell = {x: 0, y: 0};
    var selectedArea = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    var activeMode = MODE_DRAW;

    var width = window.innerWidth;
    var height = CELL_SIZE * VERTICAL_CELLS_COUNT;

    var cellsCountByX = Math.floor(width / CELL_SIZE) + 1;
    var cellsCountByY = Math.floor(height / CELL_SIZE) + 1;

    var canvasGrid = document.getElementById('cubes-grid');
    var canvas = document.getElementById('cubes-canvas');

    var controlsNode = document.querySelector('.js-controls');
    var buttonClearAll = document.querySelector('.js-clear-all');
    var buttonSaveImage = document.querySelector('.js-save-image');

    var pickAreaNode = document.querySelector('.js-pick-area');

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
        };

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

        this.replaceArea = function(cellCoords, data) {
            var height = data.length;
            var width = data[0].length;

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    var cell = data[i][j];
                    this.data[cellCoords.y + i][cellCoords.x + j] = {
                        top: cell.top,
                        left: cell.left,
                        diagonal: cell.diagonal
                    };
                }
            }
            this.syncWithStorage();
            redrawArea(cellCoords.x, cellCoords.y, width, height);
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

    function redrawArea(x, y, width, height) {
        ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, width * CELL_SIZE, height * CELL_SIZE);
        for (var i = y; i < y + height; i++) {
            for (var j = x; j < x + width; j++) {
                var cell = notebook.data[i][j];
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

    function redrawAll() {
        redrawArea(0, 0, cellsCountByX, cellsCountByY);
    }

    function drawFromStorage() {
        notebook.data = JSON.parse(localStorage.getItem('notebookData'));
        redrawAll();
    }

    function getOffset(element) {
        var box = element.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    // Если что-то уже есть в localStorage, рисуем оттуда
    if (localStorage.getItem('notebookData')) {
        drawFromStorage();
    } else {
        notebook.createEmptyNotebook();
    }

    var canvasOffset = getOffset(canvas);

    var buffer = {
        data: [],
        cellStart: {},
        cellEnd: {},

        // копируем прямоугольную область из notebook.data
        copy: function(selectedArea) {
            var dx = Math.abs(selectedArea.x2 - selectedArea.x1);
            var dy = Math.abs(selectedArea.y2 - selectedArea.y1);

            for (var i = 0; i <= dy; i++) {
                this.data[i] = [];
                for (var j = 0; j <= dx; j++) {
                    this.data[i][j] = notebook.data[selectedArea.y1 + i][selectedArea.x1 + j];
                }
            }
        },

        // копируем содержимое buffer.data в notebooke.data начиная с ячейки (y, x);
        paste: function(targetCell) {
            var height = this.data.length;
            var width = this.data[0].length;
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    var cell = this.data[i][j];
                    notebook.data[targetCell.y + i][targetCell.x + j] = {
                        top: cell.top,
                        left: cell.left,
                        diagonal: cell.diagonal
                    }
                }
            }
            notebook.syncWithStorage();
            redrawArea(targetCell.x, targetCell.y, width, height);
        }
    };

    var actionsForModeDraw = {
        process: false,

        currentCell: {},

        mousedown: function(x, y, altKey) {
            this.process = true;

            var cellCoords = getCellCoords(x, y);

            // координаты клика относительно текущей ячейки
            // по ним определяем какую именно сторону ячейки пользователь хочет нарисовать
            var distanceToTop = y - (cellCoords.y * CELL_SIZE);
            var distanceToBottom = ((cellCoords.y + 1) * CELL_SIZE) - y;
            var distanceToLeft = x - (cellCoords.x * CELL_SIZE);
            var distanceToRight = ((cellCoords.x + 1) * CELL_SIZE) - x;

            // стираем всю клетку
            if (altKey) {
                notebook.removeCell(cellCoords);
                return;
            }

            // рисуем необходимую линиию в зависимости от того к какой стороне ячейки кликнули ближе
            if (distanceToTop <= DIVIATION && distanceToTop <= distanceToLeft && distanceToTop < distanceToRight) {
                notebook.addStroke(cellCoords, 'top');
                this.currentCell.strokeType = 'top';
            }
            else if (distanceToRight <= DIVIATION && distanceToRight <= distanceToTop && distanceToRight < distanceToBottom) {
                cellCoords.x += 1;
                notebook.addStroke(cellCoords, 'left');
                this.currentCell.strokeType = 'left';
            }
            else if (distanceToBottom <= DIVIATION && distanceToBottom <= distanceToRight && distanceToBottom < distanceToLeft) {
                cellCoords.y += 1;
                notebook.addStroke(cellCoords, 'top');
                this.currentCell.strokeType = 'top';
            }
            else if (distanceToLeft <= DIVIATION && distanceToLeft <= distanceToBottom && distanceToLeft < distanceToTop) {
                notebook.addStroke(cellCoords, 'left');
                this.currentCell.strokeType = 'left';
            }
            else {
                notebook.addStroke(cellCoords, 'diagonal');
                this.currentCell.strokeType = 'diagonal';
            }

            // запоминаем информацию о ячейке, в которой произошло событие mousedown
            // необходимо для рисования длинных линии по протягиванию мыши
            this.currentCell.coords = {
                x: cellCoords.x,
                y: cellCoords.y
            }
        },

        mousemove: function(x, y, altKey) {
            if (this.process) {

                var cellCoords = getCellCoords(x, y);
                var cell = notebook.data[cellCoords.y][cellCoords.x];

                // стираем всю клетку
                if (altKey) {
                    notebook.removeCell(cellCoords);
                    return;
                }

                switch (this.currentCell.strokeType) {
                    case 'top':
                        if (!cell.top) {
                            cellCoords.y = this.currentCell.coords.y;
                            notebook.addStroke(cellCoords, 'top');
                        }
                        break;
                    case 'left':
                        if (!cell.left) {
                            cellCoords.x = this.currentCell.coords.x;
                            notebook.addStroke(cellCoords, 'left');
                        }
                        break;
                    case 'diagonal':
                        if (!cell.diagonal) {
                            var deltaX = cellCoords.x - this.currentCell.coords.x;
                            var deltaY = cellCoords.y - this.currentCell.coords.y;

                            if (deltaX > 0 && deltaY < 0) {
                                cellCoords.x = this.currentCell.coords.x - Math.min(deltaX, deltaY);
                                cellCoords.y = this.currentCell.coords.y + Math.min(deltaX, deltaY);
                                notebook.addStroke(cellCoords, 'diagonal');
                            }

                            if (deltaX < 0 && deltaY > 0) {
                                cellCoords.x = this.currentCell.coords.x + Math.min(deltaX, deltaY);
                                cellCoords.y = this.currentCell.coords.y - Math.min(deltaX, deltaY);
                                notebook.addStroke(cellCoords, 'diagonal');
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        },

        mouseup: function() {
            this.process = false;
        }
    };

    var actionsForModePick = {
        process: false,

        coords: {},

        cellCoords: {},

        mousedown: function(x, y) {
            this.process = true;

            pickAreaNode.style.display = 'none';
            pickAreaNode.style.width = 0;
            pickAreaNode.style.height = 0;
            pickAreaNode.style.left = x + 'px';
            pickAreaNode.style.top = y + 'px';

            // запоминаем координаты, где произошло событие mousedown
            this.coords = {
                x: x,
                y: y
            };

            var cellCoords = getCellCoords(x, y);

            this.cellCoords.x1 = cellCoords.x;
            this.cellCoords.y1 = cellCoords.y;
        },

        mousemove: function(x, y) {
            if (this.process) {
                var width = Math.abs(this.coords.x - x);
                var height = Math.abs(this.coords.y - y);

                if (width < 5 && height < 5) {
                    return;
                }

                pickAreaNode.style.display = 'block';

                pickAreaNode.style.width = width + 'px';
                pickAreaNode.style.height = height + 'px';
            }
        },

        mouseup: function(x, y) {
            this.process = false;
            //pickAreaNode.style.display = 'none';

            var cellCoords = getCellCoords(x, y);

            this.cellCoords.x2 = cellCoords.x;
            this.cellCoords.y2 = cellCoords.y;

            selectedArea = {
                x1: this.cellCoords.x1,
                y1: this.cellCoords.y1,
                x2: this.cellCoords.x2,
                y2: this.cellCoords.y2
            }
        }
    };


    canvas.addEventListener('click', function(event) {
        var x = event.pageX - canvasOffset.left;
        var y = event.pageY - canvasOffset.top;

        var cellCoords = getCellCoords(x, y);

        switch (activeMode) {
            case MODE_PICK:
                targetCell = {
                    x: cellCoords.x,
                    y: cellCoords.y
                };
                break;
            default:
                break;
        }
    });

    canvas.addEventListener('mousedown', function(event) {
        var x = event.pageX - canvasOffset.left;
        var y = event.pageY - canvasOffset.top;

        switch (activeMode) {
            case MODE_DRAW:
                actionsForModeDraw.mousedown(x, y, event.altKey);
                break;
            case MODE_PICK:
                actionsForModePick.mousedown(x, y);
                break;
            default:
                break;
        }
    });

    canvas.addEventListener('mousemove', function(event) {
        var x = event.pageX - canvasOffset.left;
        var y = event.pageY - canvasOffset.top;

        switch (activeMode) {
            case MODE_DRAW:
                actionsForModeDraw.mousemove(x, y, event.altKey);
                break;
            case MODE_PICK:
                actionsForModePick.mousemove(x, y);
                break;
            default:
                break;
        }
    });

    document.addEventListener('mouseup', function(event) {
        var x = event.pageX - canvasOffset.left;
        var y = event.pageY - canvasOffset.top;

        switch (activeMode) {
            case MODE_DRAW:
                actionsForModeDraw.mouseup();
                break;
            case MODE_PICK:
                actionsForModePick.mouseup(x, y);
                break;
            default:
                break;
        }
    });

    controlsNode.addEventListener('click', function(event) {
        var elementClasses = event.target.classList;

        if (elementClasses.contains('js-mode')) {
            var button = event.target;
            var mode = button.getAttribute('data-mode');
            var classPressed = 'button_pressed';

            if (elementClasses.contains(classPressed)) {
                elementClasses.remove('button_pressed');
                activeMode = MODE_DRAW;
            } else {
                elementClasses.add('button_pressed');
                activeMode = mode;
            }
        }
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

    var ctrlDown = false;
    var keyCodes = {
        ctrl: 17,
        cmd: 91,
        c: 67,
        v: 86
    };

    document.addEventListener('keydown', function(event) {
        if (activeMode === MODE_PICK) {
            if (event.keyCode === keyCodes.ctrl || event.keyCode === keyCodes.cmd) {
                ctrlDown = true;
            }

            if (event.keyCode === keyCodes.c) {
                buffer.copy(selectedArea);
            }
            if (event.keyCode === keyCodes.v) {
                buffer.paste(targetCell);
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.keyCode === keyCodes.ctrl || event.keyCode === keyCodes.cmd) {
            ctrlDown = false;
        }
    });

})();