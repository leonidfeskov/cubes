/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const CELL_SIZE = 30;
/* harmony export (immutable) */ __webpack_exports__["i"] = CELL_SIZE;

const CELLS_COUNT_BY_X = 50;
/* harmony export (immutable) */ __webpack_exports__["k"] = CELLS_COUNT_BY_X;

const CELLS_COUNT_BY_Y = 40;
/* harmony export (immutable) */ __webpack_exports__["j"] = CELLS_COUNT_BY_Y;

const DIVIATION = Math.round(CELL_SIZE / 5);
/* harmony export (immutable) */ __webpack_exports__["l"] = DIVIATION;


const WIDTH = CELL_SIZE * CELLS_COUNT_BY_X;
/* harmony export (immutable) */ __webpack_exports__["e"] = WIDTH;

const HEIGHT = CELL_SIZE * CELLS_COUNT_BY_Y;
/* harmony export (immutable) */ __webpack_exports__["f"] = HEIGHT;


const COLOR_GRID = '#EEEEEE';
/* harmony export (immutable) */ __webpack_exports__["g"] = COLOR_GRID;

const COLOR_STROKE = '#212121';
/* harmony export (immutable) */ __webpack_exports__["h"] = COLOR_STROKE;


const MODE_DRAW = 'DRAW';
/* harmony export (immutable) */ __webpack_exports__["d"] = MODE_DRAW;

const MODE_CLEAR = 'CLEAR';
/* harmony export (immutable) */ __webpack_exports__["c"] = MODE_CLEAR;

const MODE_PICK = 'PICK';
/* harmony export (immutable) */ __webpack_exports__["a"] = MODE_PICK;


const KEY_CODES = {
    alt: 18,
    ctrl: 17,
    cmd: 91,
    c: 67,
    v: 86,
    x: 88
};
/* harmony export (immutable) */ __webpack_exports__["b"] = KEY_CODES;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["b"] = getCellCoords;
/* harmony export (immutable) */ __webpack_exports__["a"] = getOffset;
/* harmony export (immutable) */ __webpack_exports__["c"] = mergeCells;


function getCellCoords(x, y) {
    return {
        x: Math.floor(x / __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */]),
        y: Math.floor(y / __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */])
    };
}

function getOffset(element) {
    let box = element.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function mergeCells(cell1, cell2) {
    return {
        top: cell1.top || cell2.top,
        left: cell1.left || cell2.left,
        diagonal: cell1.diagonal || cell2.diagonal
    };
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = drawGrid;
/* harmony export (immutable) */ __webpack_exports__["f"] = drawStroke;
/* harmony export (immutable) */ __webpack_exports__["c"] = clearAll;
/* harmony export (immutable) */ __webpack_exports__["e"] = redrawAll;
/* harmony export (immutable) */ __webpack_exports__["d"] = selectCell;
/* harmony export (immutable) */ __webpack_exports__["b"] = hideSelectedCells;


let pickAreaNode = document.querySelector('.js-pick-area');

let canvasGrid = document.getElementById('cubes-grid');
let canvas = document.getElementById('cubes-canvas');

let ctxGrid = canvasGrid.getContext('2d');
let ctx = canvas.getContext('2d');

canvas.width = canvasGrid.width = __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* WIDTH */];
canvas.height = canvasGrid.height = __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* HEIGHT */];

ctxGrid.strokeStyle = __WEBPACK_IMPORTED_MODULE_0__consts__["g" /* COLOR_GRID */];
ctx.strokeStyle = __WEBPACK_IMPORTED_MODULE_0__consts__["h" /* COLOR_STROKE */];

function drawGrid() {
    // горизонтальные линии
    ctxGrid.beginPath();
    let i = 0;
    while (__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * i <= __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* HEIGHT */]) {
        ctxGrid.moveTo(0, __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * i);
        ctxGrid.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["e" /* WIDTH */], __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * i);
        i++;
    }

    // вертикальные линии
    let j = 0;
    while (__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * j <= __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* WIDTH */]) {
        ctxGrid.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * j, 0);
        ctxGrid.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * j, __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* HEIGHT */]);
        j++;
    }
    ctxGrid.closePath();
    ctxGrid.stroke();
}

function drawStroke(cellCoords, strokeType) {
    ctx.beginPath();

    switch (strokeType) {
        case 'top':
            ctx.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.y);
            ctx.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * (cellCoords.x + 1), __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.y);
            break;
        case 'left':
            ctx.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.y);
            ctx.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * (cellCoords.y + 1));
            break;
        case 'diagonal':
            ctx.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * (cellCoords.y + 1));
            ctx.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * (cellCoords.x + 1), __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] * cellCoords.y);
            break;
        default:
            break;
    }

    ctx.closePath();
    ctx.stroke();
}

function clearAll() {
    ctx.clearRect(0, 0, __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* WIDTH */], __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* HEIGHT */]);
}

function redrawAll(data) {
    clearAll();

    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_0__consts__["j" /* CELLS_COUNT_BY_Y */]; i++) {
        for (let j = 0; j < __WEBPACK_IMPORTED_MODULE_0__consts__["k" /* CELLS_COUNT_BY_X */]; j++) {
            let cell = data[i][j];
            let cellCoords = {
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

function selectCell(cellCoords) {
    pickAreaNode.style.display = 'none';
    pickAreaNode.style.left = cellCoords.x * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
    pickAreaNode.style.top = cellCoords.y * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
    pickAreaNode.style.width = __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
    pickAreaNode.style.height = __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
    pickAreaNode.style.display = 'block';
}

function hideSelectedCells() {
    pickAreaNode.style.display = 'none';
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_utils__ = __webpack_require__(1);


class ActionsClearMode {
    constructor(notebook) {
        this.notebook = notebook;
        this.process = false;
        this.currentCell = {};
    }

    clearCell(x, y) {
        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_utils__["b" /* getCellCoords */])(x, y);
        this.notebook.removeCell(cellCoords);
    }

    mousedown(x, y, event) {
        event.preventDefault();
        this.process = true;

        this.clearCell(x, y);
    }

    mousemove(x, y) {
        if (this.process) {
            this.clearCell(x, y);
        }
    }

    mouseup() {
        this.process = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActionsClearMode;
;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_utils__ = __webpack_require__(1);



class ActionsDrawMode {
    constructor(notebook) {
        this.notebook = notebook;
        this.process = false;
        this.currentCell = {};
    }

    mousedown(x, y, event) {
        event.preventDefault();
        this.process = true;

        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

        // координаты клика относительно текущей ячейки
        // по ним определяем какую именно сторону ячейки пользователь хочет нарисовать
        let distanceToTop = y - cellCoords.y * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */];
        let distanceToBottom = (cellCoords.y + 1) * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] - y;
        let distanceToLeft = x - cellCoords.x * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */];
        let distanceToRight = (cellCoords.x + 1) * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] - x;

        // рисуем необходимую линиию в зависимости от того к какой стороне ячейки кликнули ближе
        if (distanceToTop <= __WEBPACK_IMPORTED_MODULE_0__consts__["l" /* DIVIATION */] && distanceToTop <= distanceToLeft && distanceToTop < distanceToRight) {
            this.notebook.addStroke(cellCoords, 'top');
            this.currentCell.strokeType = 'top';
        } else if (distanceToRight <= __WEBPACK_IMPORTED_MODULE_0__consts__["l" /* DIVIATION */] && distanceToRight <= distanceToTop && distanceToRight < distanceToBottom) {
            cellCoords.x += 1;
            this.notebook.addStroke(cellCoords, 'left');
            this.currentCell.strokeType = 'left';
        } else if (distanceToBottom <= __WEBPACK_IMPORTED_MODULE_0__consts__["l" /* DIVIATION */] && distanceToBottom <= distanceToRight && distanceToBottom < distanceToLeft) {
            cellCoords.y += 1;
            this.notebook.addStroke(cellCoords, 'top');
            this.currentCell.strokeType = 'top';
        } else if (distanceToLeft <= __WEBPACK_IMPORTED_MODULE_0__consts__["l" /* DIVIATION */] && distanceToLeft <= distanceToBottom && distanceToLeft < distanceToTop) {
            this.notebook.addStroke(cellCoords, 'left');
            this.currentCell.strokeType = 'left';
        } else {
            this.notebook.addStroke(cellCoords, 'diagonal');
            this.currentCell.strokeType = 'diagonal';
        }

        // запоминаем информацию о ячейке, в которой произошло событие mousedown
        // необходимо для рисования длинных линии по протягиванию мыши
        this.currentCell.coords = {
            x: cellCoords.x,
            y: cellCoords.y
        };
    }

    mousemove(x, y, event) {
        if (this.process) {

            let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);
            let cell = this.notebook.data[cellCoords.y][cellCoords.x];

            switch (this.currentCell.strokeType) {
                case 'top':
                    if (!cell.top) {
                        cellCoords.y = this.currentCell.coords.y;
                        this.notebook.addStroke(cellCoords, 'top');
                    }
                    break;
                case 'left':
                    if (!cell.left) {
                        cellCoords.x = this.currentCell.coords.x;
                        this.notebook.addStroke(cellCoords, 'left');
                    }
                    break;
                case 'diagonal':
                    if (!cell.diagonal) {
                        let deltaX = cellCoords.x - this.currentCell.coords.x;
                        let deltaY = cellCoords.y - this.currentCell.coords.y;

                        if (deltaX > 0 && deltaY < 0) {
                            cellCoords.x = this.currentCell.coords.x - Math.min(deltaX, deltaY);
                            cellCoords.y = this.currentCell.coords.y + Math.min(deltaX, deltaY);
                            this.notebook.addStroke(cellCoords, 'diagonal');
                        }

                        if (deltaX < 0 && deltaY > 0) {
                            cellCoords.x = this.currentCell.coords.x + Math.min(deltaX, deltaY);
                            cellCoords.y = this.currentCell.coords.y - Math.min(deltaX, deltaY);
                            this.notebook.addStroke(cellCoords, 'diagonal');
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    mouseup() {
        this.process = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActionsDrawMode;
;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_utils__ = __webpack_require__(1);



let pickAreaNode = document.querySelector('.js-pick-area');

class ActionsPickMode {
    constructor() {
        this.click = true;
        this.process = false;
        this.coordsClick = {};
        this.area = {};
    }

    mousedown(x, y, event) {
        event.preventDefault();

        this.click = true;
        this.process = true;

        pickAreaNode.style.display = 'none';
        pickAreaNode.style.width = 0;
        pickAreaNode.style.height = 0;
        pickAreaNode.style.left = x + 'px';
        pickAreaNode.style.top = y + 'px';

        // запоминаем координаты, где произошло событие mousedown
        this.coordsClick = {
            x: x,
            y: y
        };

        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

        this.area.x1 = cellCoords.x;
        this.area.y1 = cellCoords.y;
    }

    mousemove(x, y, event) {
        if (this.process) {
            let width = Math.abs(this.coordsClick.x - x);
            let height = Math.abs(this.coordsClick.y - y);

            if (width < 5 && height < 5) {
                return;
            }
            this.click = false;

            pickAreaNode.style.display = 'block';
            pickAreaNode.style.width = width + 'px';
            pickAreaNode.style.height = height + 'px';
        }
    }

    mouseup(x, y) {
        this.process = false;

        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

        this.area.x2 = cellCoords.x;
        this.area.y2 = cellCoords.y;

        let selectedArea = {
            x1: this.area.x1 + 1,
            y1: this.area.y1 + 1,
            x2: this.area.x2 - 1,
            y2: this.area.y2 - 1
        };

        pickAreaNode.style.left = selectedArea.x1 * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
        pickAreaNode.style.top = selectedArea.y1 * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
        pickAreaNode.style.width = (selectedArea.x2 - selectedArea.x1 + 1) * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
        pickAreaNode.style.height = (selectedArea.y2 - selectedArea.y1 + 1) * __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* CELL_SIZE */] + 'px';
        // Возвращаем координаты выделенной области
        return selectedArea;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActionsPickMode;
;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_utils__ = __webpack_require__(1);




let Cell = function () {
    return {
        top: null,
        left: null,
        diagonal: null
    };
};

class Notebook {
    constructor() {
        this.data = [];

        this.buffer = [];

        this.targetCell = { x: 0, y: 0 };

        this.selectedArea = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };

        this.mode = __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */];

        if (localStorage.getItem('notebookData')) {
            this.data = JSON.parse(localStorage.getItem('notebookData'));
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["e" /* redrawAll */])(this.data);
        } else {
            this.createEmptyData();
        }
    }

    createEmptyData() {
        for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_0__consts__["j" /* CELLS_COUNT_BY_Y */]; i++) {
            this.data[i] = [];
            for (let j = 0; j < __WEBPACK_IMPORTED_MODULE_0__consts__["k" /* CELLS_COUNT_BY_X */]; j++) {
                this.data[i][j] = new Cell();
            }
        }
    }

    syncWithStorage() {
        localStorage.setItem('notebookData', JSON.stringify(this.data));
    }

    addStroke(cellCoords, strokeType) {
        let x = cellCoords.x;
        let y = cellCoords.y;

        if (!this.data[y][x][strokeType]) {
            this.data[y][x][strokeType] = true;
            this.syncWithStorage();
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["f" /* drawStroke */])(cellCoords, strokeType);
        }
    }

    removeCell(cellCoords) {
        let x = cellCoords.x;
        let y = cellCoords.y;

        this.data[y][x] = new Cell();
        this.data[y + 1][x].top = null;
        this.data[y][x + 1].left = null;

        this.syncWithStorage();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["e" /* redrawAll */])(this.data);
    }

    clearArea(selectedArea) {
        let { x1, y1, x2, y2 } = selectedArea;

        for (let i = y1; i <= y2 + 1; i++) {
            for (let j = x1; j <= x2 + 1; j++) {
                // так как каждая ячейка хранит только верхнюю и левую стороны,
                // то стираем еще и левые границы в столбце правее выделенной области
                // и верхние границы в строке ниже выделенной области
                if (j === x2 + 1 && i === y2 + 1) {
                    continue;
                }

                if (j === x2 + 1) {
                    this.data[i][j].left = null;
                    continue;
                }

                if (i === y2 + 1) {
                    this.data[i][j].top = null;
                    continue;
                }

                this.data[i][j] = new Cell();
            }
        }

        this.syncWithStorage();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["e" /* redrawAll */])(this.data);
    }

    copy() {
        let { x1, y1, x2, y2 } = this.selectedArea;
        let dx = Math.abs(x2 - x1 + 1);
        let dy = Math.abs(y2 - y1 + 1);

        this.buffer = [];

        for (let i = 0; i <= dy; i++) {
            this.buffer[i] = [];
            for (let j = 0; j <= dx; j++) {

                // так как каждая ячейка хранит только верхнюю и левую стороны,
                // то копируем в буфер еще информацию об одном столбце правее и одной строке ниже выделенной областе
                if (j === dx && i === dy) {
                    this.buffer[i][j] = new Cell();
                    continue;
                }

                if (j === dx) {
                    this.buffer[i][j] = {
                        left: this.data[y1 + i][x1 + j].left
                    };
                    continue;
                }

                if (i === dy) {
                    this.buffer[i][j] = {
                        top: this.data[y1 + i][x1 + j].top
                    };
                    continue;
                }

                this.buffer[i][j] = this.data[y1 + i][x1 + j];
            }
        }
    }

    cut() {
        this.copy();
        this.clearArea(this.selectedArea);
    }

    paste() {
        let height = this.buffer.length;
        let width = this.buffer[0].length;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let cell = this.data[this.targetCell.y + i][this.targetCell.x + j];
                let bufferCell = this.buffer[i][j];

                let newCell = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["c" /* mergeCells */])(cell, bufferCell);

                this.data[this.targetCell.y + i][this.targetCell.x + j] = newCell;
            }
        }
        this.syncWithStorage();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["e" /* redrawAll */])(this.data);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Notebook;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_notebook__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_drawMode__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_clearMode__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_pickMode__ = __webpack_require__(5);








let canvas = document.getElementById('cubes-canvas');
let ctx = canvas.getContext('2d');

let controlsNode = document.querySelector('.js-controls');
let controlColor = document.querySelector('.js-control-color');

let buttonClearAll = document.querySelector('.js-clear-all');
let buttonSaveImage = document.querySelector('.js-save-image');

let isPressedCtrl = false;

let notebook = new __WEBPACK_IMPORTED_MODULE_2__models_notebook__["a" /* default */]();
let actionsDrawMode = new __WEBPACK_IMPORTED_MODULE_4__actions_drawMode__["a" /* default */](notebook);
let actionsClearMode = new __WEBPACK_IMPORTED_MODULE_5__actions_clearMode__["a" /* default */](notebook);
let actionsPickMode = new __WEBPACK_IMPORTED_MODULE_6__actions_pickMode__["a" /* default */](notebook);

let canvasOffset = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["a" /* getOffset */])(canvas);
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__draw__["a" /* drawGrid */])();

// выбор режима работы (рисование, выделение, стирание)
controlsNode.addEventListener('click', function (event) {
    let button = event.target;
    let elementClasses = button.classList;

    if (elementClasses.contains('js-mode')) {
        let mode = button.getAttribute('data-mode');
        let classPressed = 'button-control_pressed';

        let prevActiveButton = controlsNode.querySelector('.' + classPressed);
        prevActiveButton.classList.remove(classPressed);

        elementClasses.add(classPressed);
        notebook.mode = mode;

        if (mode !== __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* MODE_PICK */]) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__draw__["b" /* hideSelectedCells */])();
        }
    }
});

// выбор цвета линий
controlColor.addEventListener('click', function (event) {
    let button = event.target;
    let elementClasses = button.classList;

    if (elementClasses.contains('control-color')) {
        let prevActiveButton = controlColor.querySelector('.current');
        prevActiveButton.classList.remove('current');
        elementClasses.add('current');

        let color = button.style.backgroundColor;
        ctx.strokeStyle = color;
    }
});

// Стереть все
buttonClearAll.addEventListener('click', function () {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__draw__["c" /* clearAll */])();
    localStorage.clear();
    notebook.createEmptyData();
});

// Сохранить картинку
buttonSaveImage.addEventListener('click', function () {
    let dataURL = canvas.toDataURL();
    window.open(dataURL);
});

// Горячие клавиши (CTRL+C, CTRL+V, CTRL+X, ALT - режим стирания)
document.addEventListener('keydown', function (event) {
    if (notebook.mode === __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* MODE_PICK */]) {
        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].ctrl || event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].cmd) {
            isPressedCtrl = true;
        }

        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].alt) {
            notebook.mode = __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_CLEAR */];
        }

        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].c) {
            notebook.copy();
        }
        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].x) {
            notebook.cut();
        }
        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].v) {
            notebook.paste();
        }
    }
});

document.addEventListener('keyup', function (event) {
    if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].ctrl || event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].cmd) {
        isPressedCtrl = false;
    }

    if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* KEY_CODES */].alt) {
        notebook.mode = __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */];
    }
});

canvas.addEventListener('click', function (event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

    switch (notebook.mode) {
        case __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* MODE_PICK */]:
            if (actionsPickMode.click) {
                notebook.targetCell = {
                    x: cellCoords.x,
                    y: cellCoords.y
                };
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__draw__["d" /* selectCell */])(cellCoords);
            }
            break;
        default:
            break;
    }
});

canvas.addEventListener('mousedown', function (event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
        case __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */]:
            actionsDrawMode.mousedown(x, y, event);
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_CLEAR */]:
            actionsClearMode.mousedown(x, y, event);
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* MODE_PICK */]:
            actionsPickMode.mousedown(x, y, event);
            break;
        default:
            break;
    }
});

canvas.addEventListener('mousemove', function (event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
        case __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */]:
            actionsDrawMode.mousemove(x, y, event);
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_CLEAR */]:
            actionsClearMode.mousemove(x, y, event);
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* MODE_PICK */]:
            actionsPickMode.mousemove(x, y, event);
            break;
        default:
            break;
    }
});

document.addEventListener('mouseup', function (event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
        case __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */]:
            actionsDrawMode.mouseup();
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_CLEAR */]:
            actionsClearMode.mouseup();
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* MODE_PICK */]:
            notebook.selectedArea = actionsPickMode.mouseup(x, y, event);
            break;
        default:
            break;
    }
});

/***/ })
/******/ ]);