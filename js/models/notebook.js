import { CELLS_COUNT_BY_X, CELLS_COUNT_BY_Y, MODE_DRAW } from '../consts';
import { drawStroke, redrawAll } from '../draw';
import { mergeCells } from '../utils/utils';


let Cell = function() {
    return {
        top: null,
        left: null,
        diagonal: null
    };
};

export default class Notebook {
    constructor() {
        this.data = [];

        this.buffer = [];

        this.targetCell = {x: 0, y: 0};

        this.selectedArea = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };

        this.mode = MODE_DRAW;

        if (localStorage.getItem('notebookData')) {
            this.data = JSON.parse(localStorage.getItem('notebookData'));
            redrawAll(this.data);
        } else {
            this.createEmptyData();
        }
    }

    createEmptyData() {
        for (let i = 0; i < CELLS_COUNT_BY_Y; i++) {
            this.data[i] = [];
            for (let j = 0; j < CELLS_COUNT_BY_X; j++) {
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
            drawStroke(cellCoords, strokeType);
        }
    }

    removeCell(cellCoords) {
        let x = cellCoords.x;
        let y = cellCoords.y;

        this.data[y][x] = new Cell();
        this.data[y + 1][x].top = null;
        this.data[y][x + 1].left = null;

        this.syncWithStorage();
        redrawAll(this.data);
    }

    clearArea(selectedArea) {
        let {x1, y1, x2, y2} = selectedArea;

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
        redrawAll(this.data);
    }

    copy() {
        let {x1, y1, x2, y2} = this.selectedArea;
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

                let newCell = mergeCells(cell, bufferCell);

                this.data[this.targetCell.y + i][this.targetCell.x + j] = newCell;
            }
        }
        this.syncWithStorage();
        redrawAll(this.data);
    }
}