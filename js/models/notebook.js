import { CELLS_COUNT_BY_X, CELLS_COUNT_BY_Y, MODE_DRAW } from '../consts';
import { drawStroke, redrawAll } from '../draw';


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
            x: 0,
            y: 0,
            width: 0,
            height: 0
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

    copy() {
        let dx = Math.abs(this.selectedArea.x2 - this.selectedArea.x1);
        let dy = Math.abs(this.selectedArea.y2 - this.selectedArea.y1);

        for (let i = 0; i <= dy; i++) {
            this.buffer[i] = [];
            for (let j = 0; j <= dx; j++) {
                this.buffer[i][j] = this.data[this.selectedArea.y1 + i][this.selectedArea.x1 + j];
            }
        }
    }

    paste() {
        let height = this.buffer.length;
        let width = this.buffer[0].length;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let cell = this.buffer[i][j];
                this.data[this.targetCell.y + i][this.targetCell.x + j] = {
                    top: cell.top,
                    left: cell.left,
                    diagonal: cell.diagonal
                }
            }
        }
        this.syncWithStorage();
        redrawAll(this.data);
    }
}