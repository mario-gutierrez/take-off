let puzzleObject;
let solvedHandler;
let gameStatus;
let thumbnailSize = 100;
let logoSize = 50;
let puzzleHasStarted = false;
let isTutorial = false;

function RenderPuzzle(puzzleDefinition, puzzleDiv, canvasSize) {
    let canvas = document.createElement("canvas");
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    canvas.setAttribute('id', "puzzleCanvas");

    document.body.style.backgroundColor = puzzleDefinition.backgroundColor;
    document.getElementById("")
    let _ctx = canvas.getContext('2d');
    _ctx.fillStyle = puzzleDefinition.backgroundColor;
    _ctx.fillRect(0, 0, canvas.width, canvas.height);

    let _borderSize = 3;
    let _maxNumOfSquares = puzzleDefinition.cols > puzzleDefinition.rows ? puzzleDefinition.cols : puzzleDefinition.rows;
    let _squareSize = Math.floor(canvas.width / _maxNumOfSquares);
    let _top = Math.floor((canvas.width - (_squareSize - _borderSize) * _maxNumOfSquares) / 2);
    let _left = Math.floor((canvas.height - (_squareSize - _borderSize) * puzzleDefinition.rows) / 2);
    let _borderColor = puzzleDefinition.backgroundColor;
    console.log(_top + ", " + _left);

    let _displayConfig = new PuzzleDisplayConfig(_top, _left, _squareSize, _borderSize,
        _borderColor, puzzleDefinition.backgroundColor, puzzleDefinition.colorsTable);
    puzzleObject = new Puzzle(_ctx, canvas, puzzleDefinition, _displayConfig);
    let overlayDiv = document.getElementById("puzzleOverlay");
    puzzleObject.overlay = overlayDiv;
    puzzleObject.overlayState = 0;

    puzzleObject.puzzleName = puzzleDefinition.puzzleName;
    puzzleDiv.appendChild(canvas);

    solvedHandler = new PuzzleSolvedHandler(puzzleDefinition.puzzleName, puzzleObject);

    puzzleObject.puzzleSolvedCallback = function () {
        solvedHandler.ShowCompletionStats(isTutorial);
    }
}

function ShowPuzzleSolution() {
    console.log("ShowPuzzleSolution");
    let footerDiv = document.getElementById("footerDiv");
    footerDiv.innerHTML = "";
    const devicePixelRatio = window.devicePixelRatio || 1;
    var thumbnail = PuzzleTools.GetThumbnailInCanvasFromJson(puzzleJson, thumbnailSize * devicePixelRatio, true, -1, 0,
        puzzleJson.backgroundColor);

    thumbnail.style.width = thumbnailSize + 'px';
    thumbnail.style.height = thumbnailSize + 'px';
    footerDiv.appendChild(thumbnail);
}

function InitBoard() {
    puzzleHasStarted = false;
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.innerHTML = "";
    let isPortrait = (window.innerWidth < window.innerHeight);
    let canvasSize = Math.round(isPortrait ? window.innerWidth * 0.8 : window.innerHeight * 0.5);
    let maxCanvasSize = 500;
    canvasSize = canvasSize > maxCanvasSize ? maxCanvasSize : canvasSize;
    document.getElementById("puzzleOverlay").style.width = Math.round(canvasSize * 1.1) + "px";
    let centralDiv = document.getElementById("centralDiv");
    centralDiv.style.height = canvasSize + "px";
    centralDiv.style.marginTop = "5vh";

    let footerDiv = document.getElementById("footerDiv");
    footerDiv.style.marginTop = canvasSize + "px";
    let footerHeight = Math.round(window.innerHeight - canvasSize) * 0.5;
    footerDiv.style.height = footerHeight + "px";
    footerDiv.innerHTML = "";
    thumbnailSize = canvasSize * 0.35;
    thumbnailSize = thumbnailSize < footerHeight * .75 ? thumbnailSize : footerHeight * .75;
    let footerPadding = (footerHeight - thumbnailSize) * .5;
    footerDiv.style.padding = footerPadding + "px";

    footerDiv.appendChild(PuzzleTools.GetPlayIconInCanvas(thumbnailSize, puzzleJson.backgroundColor));

    RenderPuzzle(puzzleJson, mainDiv, canvasSize);
}

function SetPuzzleReadyToPlay() {
    if (!puzzleHasStarted) {
        puzzleHasStarted = true;
        puzzleObject.setPuzzleReadyToPlay(puzzleObject);
        ShowPuzzleSolution();
    }
}

function SetupEventListeners() {
    document.getElementById("footerDiv").addEventListener('mouseup', function (evt) {
        SetPuzzleReadyToPlay();
    });

    document.getElementById("footerDiv").addEventListener('touchend', function (evt) {
        SetPuzzleReadyToPlay();
    });
}

function ForwardPuzzle() {
    GoBackToHomeScreen();
}

function ReloadPuzzle() {
    location.reload();
}

function GoBackToHomeScreen() {
    window.location.replace("index.html");
}

let puzzleJson = [];
let tutorials = [];


let unsolvedTutorial = 0;
let selectedCell;

puzzleJson = {
    "colors": 4, "rows": 5, "cols": 5,
    "colorsTable": ["#9DD9D9", "#7E2884", "#D44587", "#EBEBEB"],
    "layout": [[1, 0, 1, 0, 1],
    [-1, -1, 0, -1, -1],
    [-1, -1, 1, -1, -1],
    [-1, -1, 0, -1, -1],
    [-1, -1, 1, -1, -1]],
    "links": [{ "id": 0, "tblr": [0, 0, 4, 1] }, { "id": 1, "tblr": [1, 1, 0, 2] }, { "id": 2, "tblr": [22, 7, 1, 3] }, { "id": 3, "tblr": [3, 3, 2, 4] }, { "id": 4, "tblr": [4, 4, 3, 0] }, { "id": 7, "tblr": [2, 12, 7, 7] }, { "id": 12, "tblr": [7, 17, 12, 12] }, { "id": 17, "tblr": [12, 22, 17, 17] }, { "id": 22, "tblr": [17, 2, 22, 22] }],
    "backgroundColor": "#111111", "defaultScramble": 0, "randomMoves": 0,
    "puzzleName": "Take Off III"
};

window.onresize = InitBoard;

InitBoard();
SetupEventListeners();
