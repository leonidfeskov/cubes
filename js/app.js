import { MODE_DRAW, MODE_CLEAR, MODE_PICK, KEY_CODES } from './consts';
import { getCellCoords, getOffset } from './utils/utils';
import Notebook from './models/notebook';
import { drawGrid, clearAll, selectCell, hideSelectedCells } from './draw';
import ActionsDrawMode from './actions/drawMode';
import ActionsClearMode from './actions/clearMode';
import ActionsPickMode from './actions/pickMode';


let canvas = document.getElementById('cubes-canvas');
let ctx = canvas.getContext('2d');

let controlsNode = document.querySelector('.js-controls');
let controlColor = document.querySelector('.js-control-color');

let buttonClearAll = document.querySelector('.js-clear-all');
let buttonSaveImage = document.querySelector('.js-save-image');

let isPressedCtrl = false;

let notebook = new Notebook();
let actionsDrawMode = new ActionsDrawMode(notebook);
let actionsClearMode = new ActionsClearMode(notebook);
let actionsPickMode = new ActionsPickMode(notebook);

let canvasOffset = getOffset(canvas);
drawGrid();

// выбор режима работы (рисование, выделение, стирание)
controlsNode.addEventListener('click', function(event) {
    let button = event.target;
    let elementClasses = button.classList;

    if (elementClasses.contains('js-mode')) {
        let mode = button.getAttribute('data-mode');
        let classPressed = 'button-control_pressed';

        let prevActiveButton = controlsNode.querySelector('.' + classPressed);
        prevActiveButton.classList.remove(classPressed);

        elementClasses.add(classPressed);
        notebook.mode = mode;

        if (mode !== MODE_PICK) {
            hideSelectedCells();
        }
    }
});

// выбор цвета линий
controlColor.addEventListener('click', function(event) {
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
buttonClearAll.addEventListener('click', function() {
    clearAll();
    localStorage.clear();
    notebook.createEmptyData();
});

// Сохранить картинку
buttonSaveImage.addEventListener('click', function() {
    let dataURL = canvas.toDataURL();
    window.open(dataURL);
});

// Горячие клавиши (CTRL+C, CTRL+V, CTRL+X, ALT - режим стирания)
document.addEventListener('keydown', function(event) {
    if (notebook.mode === MODE_PICK) {
        if (event.keyCode === KEY_CODES.ctrl || event.keyCode === KEY_CODES.cmd) {
            isPressedCtrl = true;
        }

        if (event.keyCode === KEY_CODES.alt) {
            notebook.mode = MODE_CLEAR;
        }

        if (event.keyCode === KEY_CODES.c) {
            notebook.copy();
        }
        if (event.keyCode === KEY_CODES.x) {
            notebook.cut();
        }
        if (event.keyCode === KEY_CODES.v) {
            notebook.paste();
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.keyCode === KEY_CODES.ctrl || event.keyCode === KEY_CODES.cmd) {
        isPressedCtrl = false;
    }

    if (event.keyCode === KEY_CODES.alt) {
        notebook.mode = MODE_DRAW;
    }
});

canvas.addEventListener('click', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    let cellCoords = getCellCoords(x, y);

    switch (notebook.mode) {
        case MODE_PICK:
            if (actionsPickMode.click) {
                notebook.targetCell = {
                    x: cellCoords.x,
                    y: cellCoords.y
                };
                selectCell(cellCoords);
            }
            break;
        default:
            break;
    }
});

canvas.addEventListener('mousedown', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
        case MODE_DRAW:
            actionsDrawMode.mousedown(x, y, event);
            break;
        case MODE_CLEAR:
            actionsClearMode.mousedown(x, y, event);
            break;
        case MODE_PICK:
            actionsPickMode.mousedown(x, y, event);
            break;
        default:
            break;
    }
});

canvas.addEventListener('mousemove', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
        case MODE_DRAW:
            actionsDrawMode.mousemove(x, y, event);
            break;
        case MODE_CLEAR:
            actionsClearMode.mousemove(x, y, event);
            break;
        case MODE_PICK:
            actionsPickMode.mousemove(x, y, event);
            break;
        default:
            break;
    }
});

document.addEventListener('mouseup', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    switch (notebook.mode) {
        case MODE_DRAW:
            actionsDrawMode.mouseup();
            break;
        case MODE_CLEAR:
            actionsClearMode.mouseup();
            break;
        case MODE_PICK:
            notebook.selectedArea = actionsPickMode.mouseup(x, y, event);
            break;
        default:
            break;
    }
});