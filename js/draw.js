import { CELL_SIZE, WIDTH, HEIGHT, COLOR_GRID, COLOR_STROKE, CELLS_COUNT_BY_X, CELLS_COUNT_BY_Y } from './consts';


let pickAreaNode = document.querySelector('.js-pick-area');

let canvasGrid = document.getElementById('cubes-grid');
let canvas = document.getElementById('cubes-canvas');

let ctxGrid = canvasGrid.getContext('2d');
let ctx = canvas.getContext('2d');

canvas.width = canvasGrid.width = WIDTH;
canvas.height = canvasGrid.height = HEIGHT;

ctxGrid.strokeStyle = COLOR_GRID;
ctx.strokeStyle = COLOR_STROKE;

export function drawGrid() {
    // горизонтальные линии
    ctxGrid.beginPath();
    let i = 0;
    while (CELL_SIZE * i <= HEIGHT) {
        ctxGrid.moveTo(0, CELL_SIZE * i);
        ctxGrid.lineTo(WIDTH, CELL_SIZE * i);
        i++;
    }

    // вертикальные линии
    let j = 0;
    while (CELL_SIZE * j <= WIDTH) {
        ctxGrid.moveTo(CELL_SIZE * j, 0);
        ctxGrid.lineTo(CELL_SIZE * j, HEIGHT);
        j++;
    }
    ctxGrid.closePath();
    ctxGrid.stroke();
}

export function drawStroke(cellCoords, strokeType) {
    ctx.beginPath();

    switch (strokeType) {
        case 'top':
            ctx.moveTo(CELL_SIZE * cellCoords.x, CELL_SIZE * cellCoords.y);
            ctx.lineTo(CELL_SIZE * (cellCoords.x + 1), CELL_SIZE * cellCoords.y);
            break;
        case 'left':
            ctx.moveTo(CELL_SIZE * cellCoords.x, CELL_SIZE * cellCoords.y);
            ctx.lineTo(CELL_SIZE * cellCoords.x, CELL_SIZE * (cellCoords.y + 1));
            break;
        case 'diagonal':
            ctx.moveTo(CELL_SIZE * cellCoords.x, CELL_SIZE * (cellCoords.y + 1));
            ctx.lineTo(CELL_SIZE * (cellCoords.x + 1), CELL_SIZE * cellCoords.y);
            break;
        default:
            break;
    }

    ctx.closePath();
    ctx.stroke();
}

export function clearAll() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

export function redrawAll(data) {
    clearAll();

    for (let i = 0; i < CELLS_COUNT_BY_Y; i++) {
        for (let j = 0; j < CELLS_COUNT_BY_X; j++) {
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

export function selectCell(cellCoords) {
    pickAreaNode.style.display = 'none';
    pickAreaNode.style.left = cellCoords.x * CELL_SIZE + 'px';
    pickAreaNode.style.top = cellCoords.y * CELL_SIZE + 'px';
    pickAreaNode.style.width = CELL_SIZE + 'px';
    pickAreaNode.style.height = CELL_SIZE + 'px';
    pickAreaNode.style.display = 'block';
}