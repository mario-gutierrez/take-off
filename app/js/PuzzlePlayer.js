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


        if (gameStatus != null) {
            if (("percentScoresPerPuzzle" in gameStatus)) {
                for (let s = 0; s < gameStatus.percentScoresPerPuzzle.length; s++) {
                    if (gameStatus.percentScoresPerPuzzle[s].puzzleName == puzzleDefinition.puzzleName) {
                        gameStatus.percentScoresPerPuzzle[s].moveScore = puzzleObject.moveScorePercent;
                        gameStatus.percentScoresPerPuzzle[s].timeScore = puzzleObject.timeScorePercent;
                        break;
                    }
                }
            }
            gameStatus.puzzleStatus[selectedCell.y][selectedCell.x] = 3; // mark this puzzle as solved
            //update adjacent cells
            let rows = gameStatus.puzzleStatus.length;
            let cols = gameStatus.puzzleStatus[0].length;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    let cell = gameStatus.puzzleStatus[r][c];
                    if (r + 1 < rows) {
                        let adjacent = gameStatus.puzzleStatus[r + 1][c];
                        if (adjacent < cell) {
                            gameStatus.puzzleStatus[r + 1][c] = cell - 1;
                        }
                    }
                    if (c + 1 < cols) {
                        let adjacent = gameStatus.puzzleStatus[r][c + 1];
                        if (adjacent < cell) {
                            gameStatus.puzzleStatus[r][c + 1] = cell - 1;
                        }
                    }
                    if (r - 1 >= 0) {
                        let adjacent = gameStatus.puzzleStatus[r - 1][c];
                        if (adjacent < cell) {
                            gameStatus.puzzleStatus[r - 1][c] = cell - 1;
                        }
                    }
                    if (c - 1 >= 0) {
                        let adjacent = gameStatus.puzzleStatus[r][c - 1];
                        if (adjacent < cell) {
                            gameStatus.puzzleStatus[r][c - 1] = cell - 1;
                        }
                    }
                }
            }

            // console.log("game status: ");
            // console.log(gameStatus);
        }
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

function SetupHeader(canvasSize) {
    let headerDiv = document.getElementById("header");
    headerDiv.innerHTML = "";
    let headerHeight = Math.round(canvasSize * 0.2);
    headerDiv.style.width = Math.round(window.innerWidth) + "px";
    headerDiv.style.height = headerHeight + "px";
    logoSize = canvasSize * 0.15;

    let icons = ["back", "replay"];
    let elements = icons.length;
    let iconSize = logoSize;
    let margin = Math.round((window.innerWidth - (elements + 1) * iconSize) / (elements + 2));

    for (let i = 0; i < icons.length; i++) {
        let imgTag = document.createElement("img");
        imgTag.src = "img/icon_" + icons[i] + ".png";
        imgTag.width = iconSize;
        imgTag.style.marginRight = margin + "px";
        imgTag.className = "iconImg";
        imgTag.id = icons[i];
        headerDiv.appendChild(imgTag);
    }

    let logoElement = PuzzleTools.GetQuadratisLogoInCanvas(logoSize, puzzleJson.backgroundColor);
    headerDiv.appendChild(logoElement);
    logoElement.id = "quadratisLogo";
    logoElement.className = "logoImg";
    logoElement.style.marginRight = margin + "px";

    PuzzleTools.SetClickEvent(logoElement, function () {
        let logo = document.getElementById("quadratisLogo");
        logo.classList.toggle("fade");
        for (let i = 0; i < icons.length; i++) {
            let button = document.getElementById(icons[i]);
            button.classList.toggle("fade");
        }
    });


    PuzzleTools.SetClickEvent(document.getElementById("back"), function () {
        if (document.getElementById("back").classList.value.includes("fade")) {
            GoBackToHomeScreen();
        }
    });

    PuzzleTools.SetClickEvent(document.getElementById("replay"), function () {
        if (document.getElementById("replay").classList.value.includes("fade")) {
            location.reload();
        }
    });

    PuzzleTools.SetClickEvent(document.getElementById("statsIconButton"), function () {

        //document.getElementById("completedStats").classList.toggle("hide");
        //document.getElementById("historyStats").classList.toggle("show");

        //console.log(document.getElementById("completedStats").classList);
    });


    return headerHeight;
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
    let headerHeight = SetupHeader(canvasSize);
    centralDiv.style.height = canvasSize + "px";
    centralDiv.style.marginTop = 80 + "px";

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
