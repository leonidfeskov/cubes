import { getCellCoords } from '../utils/utils';


let pickAreaNode = document.querySelector('.js-pick-area');

export default class ActionsPickMode {
    constructor(notebook) {
        this.notebook = notebook;
        this.process = false;
        this.coords = {};
        this.cellCoords = {};
    }
    
    mousedown(x, y) {
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
    }

    mousemove(x, y) {
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
    }

    mouseup(x, y) {
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