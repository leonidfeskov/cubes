import { MODE_DRAW, MODE_PICK, KEY_CODES } from './consts';
import { getCellCoords, getOffset } from './utils/utils';
import Notebook from './models/notebook';
import { drawGrid, clearAll } from './draw';
import ActionsDrawMode from './actions/drawMode';
import ActionsPickMode from './actions/pickMode';


let canvas = document.getElementById('cubes-canvas');
let controlsNode = document.querySelector('.js-controls');
let buttonClearAll = document.querySelector('.js-clear-all');
let buttonSaveImage = document.querySelector('.js-save-image');

let isPressedCtrl = false;

drawGrid();

let notebook = new Notebook();
let actionsDrawMode = new ActionsDrawMode(notebook);
let actionsPickMode = new ActionsPickMode(notebook);

let canvasOffset = getOffset(canvas);

canvas.addEventListener('click', function(event) {
    let x = event.pageX - canvasOffset.left;
    let y = event.pageY - canvasOffset.top;

    let cellCoords = getCellCoords(x, y);

    switch (notebook.mode) {
        case MODE_PICK:
            notebook.targetCell = {
                x: cellCoords.x,
                y: cellCoords.y
            };
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
            actionsDrawMode.mousedown(x, y, event.altKey);
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
            actionsDrawMode.mousemove(x, y, event.altKey);
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
        case MODE_PICK:
            notebook.selectedArea = actionsPickMode.mouseup(x, y);
            break;
        default:
            break;
    }
});

controlsNode.addEventListener('click', function(event) {
    let elementClasses = event.target.classList;

    if (elementClasses.contains('js-mode')) {
        let button = event.target;
        let mode = button.getAttribute('data-mode');
        let classPressed = 'button_pressed';

        if (elementClasses.contains(classPressed)) {
            elementClasses.remove('button_pressed');
            notebook.mode = MODE_DRAW;
        } else {
            elementClasses.add('button_pressed');
            notebook.mode = mode;
        }
    }
});

buttonClearAll.addEventListener('click', function() {
    clearAll();
    localStorage.clear();
    notebook.createEmptyData();
});

buttonSaveImage.addEventListener('click', function() {
    let dataURL = canvas.toDataURL();
    window.open(dataURL);
});

document.addEventListener('keydown', function(event) {
    if (notebook.mode === MODE_PICK) {
        if (event.keyCode === KEY_CODES.ctrl || event.keyCode === KEY_CODES.cmd) {
            isPressedCtrl = true;
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
});