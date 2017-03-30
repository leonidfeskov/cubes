(function(){
    'use strict';

    var cellSize = 30;
    var deviation = Math.round(cellSize / 5);

    var canvasGrid = document.getElementById('cubes-grid');
    var ctxGrid = canvasGrid.getContext('2d');

    var canvas = document.getElementById('cubes-canvas');
    var ctx = canvas.getContext('2d');

    var width = window.innerWidth;
    var height = window.innerHeight;

    canvasGrid.width = width;
    canvasGrid.height = height;
    canvas.width = width;
    canvas.height = height;

    ctxGrid.strokeStyle = '#EEEEEE';
    ctxGrid.lineWidth = 1;
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 1;

    function Cell() {
        this.top = false;
        this.bottom = false;
        this.diagonal = false;
    }

    var userImage = {
        cells: []
    }

    // рисуем сетку
    // горизонтальные линии
    ctxGrid.beginPath();
    var i = 0;
    while (cellSize * i <= height) {
        ctxGrid.moveTo(0, cellSize * i);
        ctxGrid.lineTo(width, cellSize * i);
        i++;
    }

    // вертикальные линии
    var j = 0;
    while (cellSize * j <= width) {
        ctxGrid.moveTo(cellSize * j, 0);
        ctxGrid.lineTo(cellSize * j, height);
        j++;
    }
    ctxGrid.closePath();
    ctxGrid.stroke();

    function getCellNumber(x, y) {
        var posX = Math.floor(x / cellSize);
        var posY = Math.floor(y / cellSize);
        return {
            x: posX,
            y: posY,
            coordX: posX * cellSize,
            coordY: posY * cellSize
        }
    }

    function drawDiagonal(cellNumber) {
        ctx.beginPath();
        ctx.moveTo(cellSize * cellNumber.x, cellSize * (cellNumber.y + 1));
        ctx.lineTo(cellSize * (cellNumber.x + 1), cellSize * cellNumber.y);
        ctx.closePath();
        ctx.stroke();
    }

    function drawTop(cellNumber) {
        ctx.beginPath();
        ctx.moveTo(cellSize * cellNumber.x, cellSize * cellNumber.y);
        ctx.lineTo(cellSize * (cellNumber.x + 1), cellSize * cellNumber.y);
        ctx.closePath();
        ctx.stroke();
    }

    function drawBottom(cellNumber) {
        ctx.beginPath();
        ctx.moveTo(cellSize * cellNumber.x, cellSize * (cellNumber.y + 1));
        ctx.lineTo(cellSize * (cellNumber.x + 1), cellSize * (cellNumber.y + 1));
        ctx.closePath();
        ctx.stroke();
    }

    function drawLeft(cellNumber) {
        ctx.beginPath();
        ctx.moveTo(cellSize * cellNumber.x, cellSize * cellNumber.y);
        ctx.lineTo(cellSize * cellNumber.x, cellSize * (cellNumber.y + 1));
        ctx.closePath();
        ctx.stroke();
    }

    function drawRight(cellNumber) {
        ctx.beginPath();
        ctx.moveTo(cellSize * (cellNumber.x + 1), cellSize * cellNumber.y);
        ctx.lineTo(cellSize * (cellNumber.x + 1), cellSize * (cellNumber.y + 1));
        ctx.closePath();
        ctx.stroke();
    }

    function clearCell(cellNumber) {
        ctx.clearRect(cellNumber.coordX - 1, cellNumber.coordY - 1, cellSize + 2, cellSize + 2);
    }

    document.addEventListener('click', function(event) {
        var x = event.clientX;
        var y = event.clientY;

        var cellNumber = getCellNumber(x, y);

        // координаты клика относительно текущей ячейки
        var deltaX = x - cellNumber.coordX;
        var deltaY = y - cellNumber.coordY;

        if (event.ctrlKey) {
            clearCell(cellNumber);
            return;
        }

        if (deltaX <= deviation) {
            drawLeft(cellNumber);
        } else if (deltaY <= deviation) {
            drawTop(cellNumber);
        } else if (deltaX >= cellSize - deviation) {
            drawRight(cellNumber);
        } else if (deltaY >= cellSize - deviation) {
            drawBottom(cellNumber);
        } else {
            drawDiagonal(cellNumber);
        }
    });
})();