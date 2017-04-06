import { CELL_SIZE } from '../consts';


export function getCellCoords(x, y) {
    return {
        x: Math.floor(x / CELL_SIZE),
        y: Math.floor(y / CELL_SIZE)
    }
}

export function getOffset(element) {
    let box = element.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

export function mergeCells(cell1, cell2) {
    return {
        top: cell1.top || cell2.top,
        left: cell1.left || cell2.left,
        diagonal: cell1.diagonal || cell2.diagonal
    }
}