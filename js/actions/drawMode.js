import { CELL_SIZE, DIVIATION } from '../consts';
import { getCellCoords } from '../utils/utils';


export default class ActionsDrawMode {
    constructor(notebook) {
        this.notebook = notebook;
        this.process = false;
        this.currentCell = {};
    }

    mousedown(x, y, event) {
        event.preventDefault();
        this.process = true;

        let cellCoords = getCellCoords(x, y);

        // координаты клика относительно текущей ячейки
        // по ним определяем какую именно сторону ячейки пользователь хочет нарисовать
        let distanceToTop = y - (cellCoords.y * CELL_SIZE);
        let distanceToBottom = ((cellCoords.y + 1) * CELL_SIZE) - y;
        let distanceToLeft = x - (cellCoords.x * CELL_SIZE);
        let distanceToRight = ((cellCoords.x + 1) * CELL_SIZE) - x;

        // рисуем необходимую линиию в зависимости от того к какой стороне ячейки кликнули ближе
        if (distanceToTop <= DIVIATION && distanceToTop <= distanceToLeft && distanceToTop < distanceToRight) {
            this.notebook.addStroke(cellCoords, 'top');
            this.currentCell.strokeType = 'top';
        }
        else if (distanceToRight <= DIVIATION && distanceToRight <= distanceToTop && distanceToRight < distanceToBottom) {
            cellCoords.x += 1;
            this.notebook.addStroke(cellCoords, 'left');
            this.currentCell.strokeType = 'left';
        }
        else if (distanceToBottom <= DIVIATION && distanceToBottom <= distanceToRight && distanceToBottom < distanceToLeft) {
            cellCoords.y += 1;
            this.notebook.addStroke(cellCoords, 'top');
            this.currentCell.strokeType = 'top';
        }
        else if (distanceToLeft <= DIVIATION && distanceToLeft <= distanceToBottom && distanceToLeft < distanceToTop) {
            this.notebook.addStroke(cellCoords, 'left');
            this.currentCell.strokeType = 'left';
        }
        else {
            this.notebook.addStroke(cellCoords, 'diagonal');
            this.currentCell.strokeType = 'diagonal';
        }

        // запоминаем информацию о ячейке, в которой произошло событие mousedown
        // необходимо для рисования длинных линии по протягиванию мыши
        this.currentCell.coords = {
            x: cellCoords.x,
            y: cellCoords.y
        }
    }

    mousemove(x, y, event) {
        if (this.process) {

            let cellCoords = getCellCoords(x, y);
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
};