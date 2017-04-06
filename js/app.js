import { CELL_SIZE, DIVIATION, MODE_DRAW, MODE_PICK, KEY_CODES } from './consts';
import { getCellCoords, getOffset } from './utils/utils';
import Notebook from './models/notebook';
import { drawGrid, drawStroke, clearAll } from './draw';


let canvas = document.getElementById('cubes-canvas');
let controlsNode = document.querySelector('.js-controls');
let buttonClearAll = document.querySelector('.js-clear-all');
let buttonSaveImage = document.querySelector('.js-save-image');
let pickAreaNode = document.querySelector('.js-pick-area');

let isPressedCtrl = false;

// рисуем сетку
drawGrid();

// здесь храним все данные по нарисованным линиям
let notebook = new Notebook();

let canvasOffset = getOffset(canvas);

let actionsForModeDraw = {
    process: false,

    currentCell: {},

    mousedown: function(x, y, altKey) {
        this.process = true;

        let cellCoords = getCellCoords(x, y);

        // координаты клика относительно текущей ячейки
        // по ним определяем какую именно сторону ячейки пользователь хочет нарисовать
        let distanceToTop = y - (cellCoords.y * CELL_SIZE);
        let distanceToBottom = ((cellCoords.y + 1) * CELL_SIZE) - y;
        let distanceToLeft = x - (cellCoords.x * CELL_SIZE);
        let distanceToRight = ((cellCoords.x + 1) * CELL_SIZE) - x;

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

            let cellCoords = getCellCoords(x, y);
            let cell = notebook.data[cellCoords.y][cellCoords.x];

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
                        let deltaX = cellCoords.x - this.currentCell.coords.x;
                        let deltaY = cellCoords.y - this.currentCell.coords.y;

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

let actionsForModePick = {
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

        let cellCoords = getCellCoords(x, y);

        this.cellCoords.x1 = cellCoords.x;
        this.cellCoords.y1 = cellCoords.y;
    },

    mousemove: function(x, y) {
        if (this.process) {
            let width = Math.abs(this.coords.x - x);
            let height = Math.abs(this.coords.y - y);

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

        let cellCoords = getCellCoords(x, y);

        this.cellCoords.x2 = cellCoords.x;
        this.cellCoords.y2 = cellCoords.y;

        notebook.selectedArea = {
            x1: this.cellCoords.x1,
            y1: this.cellCoords.y1,
            x2: this.cellCoords.x2,
            y2: this.cellCoords.y2
        }
    }
};


canvas.addEventListener('click', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    let cellCoords = getCellCoords(x, y);

    switch (notebook.mode) {
        case MODE_PICK:
            notebook.targetCell = {
                x: cellCoords.x,
                y: cellCoords.y
            };
            break;
        default:
            break;
    }
});

canvas.addEventListener('mousedown', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
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
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
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
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
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
    let elementClasses = event.target.classList;

    if (elementClasses.contains('js-mode')) {
        let button = event.target;
        let mode = button.getAttribute('data-mode');
        let classPressed = 'button_pressed';

        if (elementClasses.contains(classPressed)) {
            elementClasses.remove('button_pressed');
            notebook.mode = MODE_DRAW;
        } else {
            elementClasses.add('button_pressed');
            notebook.mode = mode;
        }
    }
});

buttonClearAll.addEventListener('click', function() {
    clearAll();
    localStorage.clear();
    notebook.createEmptyData();
});

buttonSaveImage.addEventListener('click', function() {
    let dataURL = canvas.toDataURL();
    window.open(dataURL);
});

document.addEventListener('keydown', function(event) {
    if (notebook.mode === MODE_PICK) {
        if (event.keyCode === KEY_CODES.ctrl || event.keyCode === KEY_CODES.cmd) {
            isPressedCtrl = true;
        }

        if (event.keyCode === KEY_CODES.c) {
            notebook.copy();
        }
        if (event.keyCode === KEY_CODES.v) {
            notebook.paste();
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.keyCode === KEY_CODES.ctrl || event.keyCode === KEY_CODES.cmd) {
        isPressedCtrl = false;
    }
});

