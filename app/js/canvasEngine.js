function getPointerPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var v;
    if (evt.clientX) {
        v = new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
    } else {
        v = new Vector(evt.changedTouches[0].clientX - rect.left, evt.changedTouches[0].clientY - rect.top);
    }
    return v;
}

function setCanvasListeners(puzzle, swipeHandler, tapHandler){
    puzzle.canvas.addEventListener('mousedown', function (evt) {
        swipeHandler.startPoint = getPointerPos(puzzle.canvas, evt);
        swipeHandler.swipeStarted = true;
    });
    
    puzzle.canvas.addEventListener('touchstart', function (evt) {
        swipeHandler.startPoint = getPointerPos(puzzle.canvas, evt);
        swipeHandler.swipeStarted = true;
        evt.preventDefault();
    });
    
    puzzle.canvas.addEventListener('mousemove', function (evt) {
        swipeHandler.processMovement(getPointerPos(puzzle.canvas, evt));        
    });
    
    puzzle.canvas.addEventListener('touchmove', function (evt) {
        swipeHandler.processMovement(getPointerPos(puzzle.canvas, evt));
        evt.preventDefault();
    });
    
    puzzle.canvas.addEventListener('mouseup', function (evt) {
        evt.preventDefault();
        if (swipeHandler.swipeStarted) {
            swipeHandler.swipeStarted = false;
            tapHandler(puzzle);
        }
    });
    
    puzzle.canvas.addEventListener('touchend', function (evt) {
        evt.preventDefault();
        if (swipeHandler.swipeStarted) {
            swipeHandler.swipeStarted = false;
            tapHandler(puzzle);
        }
    });
}
