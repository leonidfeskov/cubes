import { CELL_SIZE } from '../consts';
import { getCellCoords } from '../utils/utils';


let pickAreaNode = document.querySelector('.js-pick-area');

export default class ActionsPickMode {
    constructor() {
        this.process = false;
        this.coordsClick = {};
        this.area = {};
    }
    
    mousedown(x, y, event) {
        event.preventDefault();

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

        let cellCoords = getCellCoords(x, y);

        this.area.x1 = cellCoords.x;
        this.area.y1 = cellCoords.y;
    }

    mousemove(x, y) {
        if (this.process) {
            let width = Math.abs(this.coordsClick.x - x);
            let height = Math.abs(this.coordsClick.y - y);

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

        this.area.x2 = cellCoords.x;
        this.area.y2 = cellCoords.y;

        let selectedArea = {
            x1: this.area.x1 + 1,
            y1: this.area.y1 + 1,
            x2: this.area.x2 - 1,
            y2: this.area.y2 - 1
        };

        pickAreaNode.style.left = selectedArea.x1 * CELL_SIZE + 'px';
        pickAreaNode.style.top = selectedArea.y1 * CELL_SIZE + 'px';
        pickAreaNode.style.width = (selectedArea.x2 - selectedArea.x1 + 1) * CELL_SIZE + 'px';
        pickAreaNode.style.height = (selectedArea.y2 - selectedArea.y1 + 1) * CELL_SIZE + 'px';
        // Возвращаем координаты выделенной области
        return selectedArea;
    }
};