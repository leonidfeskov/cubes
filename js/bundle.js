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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const CELL_SIZE = 30;
/* harmony export (immutable) */ __webpack_exports__["a"] = CELL_SIZE;

const CELLS_COUNT_BY_X = 50;
/* harmony export (immutable) */ __webpack_exports__["k"] = CELLS_COUNT_BY_X;

const CELLS_COUNT_BY_Y = 40;
/* harmony export (immutable) */ __webpack_exports__["j"] = CELLS_COUNT_BY_Y;

const DIVIATION = Math.round(CELL_SIZE / 5);
/* harmony export (immutable) */ __webpack_exports__["b"] = DIVIATION;


const WIDTH = CELL_SIZE * CELLS_COUNT_BY_X;
/* harmony export (immutable) */ __webpack_exports__["f"] = WIDTH;

const HEIGHT = CELL_SIZE * CELLS_COUNT_BY_Y;
/* harmony export (immutable) */ __webpack_exports__["g"] = HEIGHT;


const COLOR_GRID = '#EEEEEE';
/* harmony export (immutable) */ __webpack_exports__["h"] = COLOR_GRID;

const COLOR_STROKE = '#212121';
/* harmony export (immutable) */ __webpack_exports__["i"] = COLOR_STROKE;


const MODE_DRAW = 'draw';
/* harmony export (immutable) */ __webpack_exports__["d"] = MODE_DRAW;

const MODE_PICK = 'pick';
/* harmony export (immutable) */ __webpack_exports__["c"] = MODE_PICK;


const KEY_CODES = {
    ctrl: 17,
    cmd: 91,
    c: 67,
    v: 86
};
/* harmony export (immutable) */ __webpack_exports__["e"] = KEY_CODES;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = drawGrid;
/* harmony export (immutable) */ __webpack_exports__["d"] = drawStroke;
/* harmony export (immutable) */ __webpack_exports__["b"] = clearAll;
/* harmony export (immutable) */ __webpack_exports__["c"] = redrawAll;


let canvasGrid = document.getElementById('cubes-grid');
let canvas = document.getElementById('cubes-canvas');

let ctxGrid = canvasGrid.getContext('2d');
let ctx = canvas.getContext('2d');

canvas.width = canvasGrid.width = __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* WIDTH */];
canvas.height = canvasGrid.height = __WEBPACK_IMPORTED_MODULE_0__consts__["g" /* HEIGHT */];

ctxGrid.strokeStyle = __WEBPACK_IMPORTED_MODULE_0__consts__["h" /* COLOR_GRID */];
ctx.strokeStyle = __WEBPACK_IMPORTED_MODULE_0__consts__["i" /* COLOR_STROKE */];

function drawGrid() {
    // горизонтальные линии
    ctxGrid.beginPath();
    var i = 0;
    while (__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * i <= __WEBPACK_IMPORTED_MODULE_0__consts__["g" /* HEIGHT */]) {
        ctxGrid.moveTo(0, __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * i);
        ctxGrid.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["f" /* WIDTH */], __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * i);
        i++;
    }

    // вертикальные линии
    var j = 0;
    while (__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * j <= __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* WIDTH */]) {
        ctxGrid.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * j, 0);
        ctxGrid.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * j, __WEBPACK_IMPORTED_MODULE_0__consts__["g" /* HEIGHT */]);
        j++;
    }
    ctxGrid.closePath();
    ctxGrid.stroke();
}

function drawStroke(cellCoords, strokeType) {
    ctx.beginPath();

    switch (strokeType) {
        case 'top':
            ctx.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.y);
            ctx.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * (cellCoords.x + 1), __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.y);
            break;
        case 'left':
            ctx.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.y);
            ctx.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * (cellCoords.y + 1));
            break;
        case 'diagonal':
            ctx.moveTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.x, __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * (cellCoords.y + 1));
            ctx.lineTo(__WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * (cellCoords.x + 1), __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] * cellCoords.y);
            break;
        default:
            break;
    }

    ctx.closePath();
    ctx.stroke();
}

function clearAll() {
    ctx.clearRect(0, 0, __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* WIDTH */], __WEBPACK_IMPORTED_MODULE_0__consts__["g" /* HEIGHT */]);
}

function redrawAll(data) {
    clearAll();

    for (var i = 0; i < __WEBPACK_IMPORTED_MODULE_0__consts__["j" /* CELLS_COUNT_BY_Y */]; i++) {
        for (var j = 0; j < __WEBPACK_IMPORTED_MODULE_0__consts__["k" /* CELLS_COUNT_BY_X */]; j++) {
            var cell = data[i][j];
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

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__draw__ = __webpack_require__(1);



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
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        this.mode = __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */];

        if (localStorage.getItem('notebookData')) {
            this.data = JSON.parse(localStorage.getItem('notebookData'));
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["c" /* redrawAll */])(this.data);
        } else {
            this.createEmptyData();
        }
    }

    createEmptyData() {
        for (var i = 0; i < __WEBPACK_IMPORTED_MODULE_0__consts__["j" /* CELLS_COUNT_BY_Y */]; i++) {
            this.data[i] = [];
            for (var j = 0; j < __WEBPACK_IMPORTED_MODULE_0__consts__["k" /* CELLS_COUNT_BY_X */]; j++) {
                this.data[i][j] = new Cell();
            }
        }
    }

    syncWithStorage() {
        localStorage.setItem('notebookData', JSON.stringify(this.data));
    }

    addStroke(cellCoords, strokeType) {
        var x = cellCoords.x;
        var y = cellCoords.y;

        if (!this.data[y][x][strokeType]) {
            this.data[y][x][strokeType] = true;
            this.syncWithStorage();
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["d" /* drawStroke */])(cellCoords, strokeType);
        }
    }

    removeCell(cellCoords) {
        var x = cellCoords.x;
        var y = cellCoords.y;

        this.data[y][x] = new Cell();
        this.data[y + 1][x].top = null;
        this.data[y][x + 1].left = null;

        this.syncWithStorage();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["c" /* redrawAll */])();
    }

    copy() {
        var dx = Math.abs(this.selectedArea.x2 - this.selectedArea.x1);
        var dy = Math.abs(this.selectedArea.y2 - this.selectedArea.y1);

        for (var i = 0; i <= dy; i++) {
            this.buffer[i] = [];
            for (var j = 0; j <= dx; j++) {
                this.buffer[i][j] = this.data[this.selectedArea.y1 + i][this.selectedArea.x1 + j];
            }
        }
    }

    paste() {
        var height = this.buffer.length;
        var width = this.buffer[0].length;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var cell = this.buffer[i][j];
                this.data[this.targetCell.y + i][this.targetCell.x + j] = {
                    top: cell.top,
                    left: cell.left,
                    diagonal: cell.diagonal
                };
            }
        }
        this.syncWithStorage();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__draw__["c" /* redrawAll */])(this.data);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Notebook;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["b"] = getCellCoords;
/* harmony export (immutable) */ __webpack_exports__["a"] = getOffset;


function getCellCoords(x, y) {
    return {
        x: Math.floor(x / __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */]),
        y: Math.floor(y / __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */])
    };
}

function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_notebook__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__draw__ = __webpack_require__(1);





let canvas = document.getElementById('cubes-canvas');
let controlsNode = document.querySelector('.js-controls');
let buttonClearAll = document.querySelector('.js-clear-all');
let buttonSaveImage = document.querySelector('.js-save-image');
let pickAreaNode = document.querySelector('.js-pick-area');

let isPressedCtrl = false;

// рисуем сетку
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__draw__["a" /* drawGrid */])();

// здесь храним все данные по нарисованным линиям
let notebook = new __WEBPACK_IMPORTED_MODULE_2__models_notebook__["a" /* default */]();

let canvasOffset = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["a" /* getOffset */])(canvas);

let actionsForModeDraw = {
    process: false,

    currentCell: {},

    mousedown: function (x, y, altKey) {
        this.process = true;

        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

        // координаты клика относительно текущей ячейки
        // по ним определяем какую именно сторону ячейки пользователь хочет нарисовать
        let distanceToTop = y - cellCoords.y * __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */];
        let distanceToBottom = (cellCoords.y + 1) * __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] - y;
        let distanceToLeft = x - cellCoords.x * __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */];
        let distanceToRight = (cellCoords.x + 1) * __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* CELL_SIZE */] - x;

        // стираем всю клетку
        if (altKey) {
            notebook.removeCell(cellCoords);
            return;
        }

        // рисуем необходимую линиию в зависимости от того к какой стороне ячейки кликнули ближе
        if (distanceToTop <= __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* DIVIATION */] && distanceToTop <= distanceToLeft && distanceToTop < distanceToRight) {
            notebook.addStroke(cellCoords, 'top');
            this.currentCell.strokeType = 'top';
        } else if (distanceToRight <= __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* DIVIATION */] && distanceToRight <= distanceToTop && distanceToRight < distanceToBottom) {
            cellCoords.x += 1;
            notebook.addStroke(cellCoords, 'left');
            this.currentCell.strokeType = 'left';
        } else if (distanceToBottom <= __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* DIVIATION */] && distanceToBottom <= distanceToRight && distanceToBottom < distanceToLeft) {
            cellCoords.y += 1;
            notebook.addStroke(cellCoords, 'top');
            this.currentCell.strokeType = 'top';
        } else if (distanceToLeft <= __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* DIVIATION */] && distanceToLeft <= distanceToBottom && distanceToLeft < distanceToTop) {
            notebook.addStroke(cellCoords, 'left');
            this.currentCell.strokeType = 'left';
        } else {
            notebook.addStroke(cellCoords, 'diagonal');
            this.currentCell.strokeType = 'diagonal';
        }

        // запоминаем информацию о ячейке, в которой произошло событие mousedown
        // необходимо для рисования длинных линии по протягиванию мыши
        this.currentCell.coords = {
            x: cellCoords.x,
            y: cellCoords.y
        };
    },

    mousemove: function (x, y, altKey) {
        if (this.process) {

            let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);
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

    mouseup: function () {
        this.process = false;
    }
};

let actionsForModePick = {
    process: false,

    coords: {},

    cellCoords: {},

    mousedown: function (x, y) {
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

        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

        this.cellCoords.x1 = cellCoords.x;
        this.cellCoords.y1 = cellCoords.y;
    },

    mousemove: function (x, y) {
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

    mouseup: function (x, y) {
        this.process = false;

        let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

        this.cellCoords.x2 = cellCoords.x;
        this.cellCoords.y2 = cellCoords.y;

        notebook.selectedArea = {
            x1: this.cellCoords.x1,
            y1: this.cellCoords.y1,
            x2: this.cellCoords.x2,
            y2: this.cellCoords.y2
        };
    }
};

canvas.addEventListener('click', function (event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    let cellCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* getCellCoords */])(x, y);

    switch (notebook.mode) {
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_PICK */]:
            notebook.targetCell = {
                x: cellCoords.x,
                y: cellCoords.y
            };
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
            actionsForModeDraw.mousedown(x, y, event.altKey);
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_PICK */]:
            actionsForModePick.mousedown(x, y);
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
            actionsForModeDraw.mousemove(x, y, event.altKey);
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_PICK */]:
            actionsForModePick.mousemove(x, y);
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
            actionsForModeDraw.mouseup();
            break;
        case __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_PICK */]:
            actionsForModePick.mouseup(x, y);
            break;
        default:
            break;
    }
});

controlsNode.addEventListener('click', function (event) {
    let elementClasses = event.target.classList;

    if (elementClasses.contains('js-mode')) {
        let button = event.target;
        let mode = button.getAttribute('data-mode');
        let classPressed = 'button_pressed';

        if (elementClasses.contains(classPressed)) {
            elementClasses.remove('button_pressed');
            notebook.mode = __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MODE_DRAW */];
        } else {
            elementClasses.add('button_pressed');
            notebook.mode = mode;
        }
    }
});

buttonClearAll.addEventListener('click', function () {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__draw__["b" /* clearAll */])();
    localStorage.clear();
    notebook.createEmptyData();
});

buttonSaveImage.addEventListener('click', function () {
    let dataURL = canvas.toDataURL();
    window.open(dataURL);
});

document.addEventListener('keydown', function (event) {
    if (notebook.mode === __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* MODE_PICK */]) {
        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* KEY_CODES */].ctrl || event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* KEY_CODES */].cmd) {
            isPressedCtrl = true;
        }

        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* KEY_CODES */].c) {
            notebook.copy();
        }
        if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* KEY_CODES */].v) {
            notebook.paste();
        }
    }
});

document.addEventListener('keyup', function (event) {
    if (event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* KEY_CODES */].ctrl || event.keyCode === __WEBPACK_IMPORTED_MODULE_0__consts__["e" /* KEY_CODES */].cmd) {
        isPressedCtrl = false;
    }
});

/***/ })
/******/ ]);