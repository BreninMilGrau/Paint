const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');
const brushSizeInput = document.getElementById('brush-size');
const colorInput = document.getElementById('color');
const brushTypeSelect = document.getElementById('brush-type');
const clearButton = document.getElementById('clear-button');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
let painting = false;
let drawingHistory = [];
let currentPosition = -1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 70;

context.lineWidth = brushSizeInput.value;
context.lineJoin = 'round';
context.lineCap = 'round';
context.strokeStyle = colorInput.value;

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    if (painting) {
        painting = false;
        saveDrawing();
    }
    context.beginPath();
}

function draw(e) {
    if (!painting) return;

    context.lineWidth = brushSizeInput.value;
    context.strokeStyle = colorInput.value;

    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    if (brushTypeSelect.value === 'round') {
        context.beginPath();
        context.arc(x, y, context.lineWidth / 2, 0, Math.PI * 2);
        context.fill();
    } else {
        context.fillRect(x - context.lineWidth / 2, y - context.lineWidth / 2, context.lineWidth, context.lineWidth);
    }

    context.beginPath();
    context.moveTo(x, y);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    currentPosition = -1;
    updateUndoRedoButtons();
}

function saveDrawing() {
    currentPosition++;
    if (currentPosition < drawingHistory.length) {
        drawingHistory.splice(currentPosition);
    }
    drawingHistory.push(canvas.toDataURL());
    updateUndoRedoButtons();
}

function undo() {
    if (currentPosition > 0) {
        currentPosition--;
        const img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
        img.src = drawingHistory[currentPosition];
        updateUndoRedoButtons();
    }
}

function redo() {
    if (currentPosition < drawingHistory.length - 1) {
        currentPosition++;
        const img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
        img.src = drawingHistory[currentPosition];
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    undoButton.disabled = currentPosition <= 0;
    redoButton.disabled = currentPosition >= drawingHistory.length - 1;
}

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
clearButton.addEventListener('click', clearCanvas);
