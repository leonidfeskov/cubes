import { getCellCoords } from '../utils/utils';


export default class ActionsClearMode {
    constructor(notebook) {
        this.notebook = notebook;
        this.process = false;
        this.currentCell = {};
    }

    clearCell(x, y) {
        let cellCoords = getCellCoords(x, y);
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
};