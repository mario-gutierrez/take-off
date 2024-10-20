class PuzzleSolvedHandler {
    constructor(localStorageRegister, puzzle) {
        this.localStorageRegister = localStorageRegister;
        this.puzzle = puzzle;
        this.puzzleStats = JSON.parse(localStorage.getItem(this.localStorageRegister)); // get from localStorage if it exists
        if (this.puzzleStats == null) {
            // assign default values
            this.puzzleStats = {};
            this.puzzleStats.bestTime = {
                minutes: 60,
                seconds: 0.0
            };
            this.puzzleStats.totalTime = {
                minutes: 0,
                seconds: 0.0
            };
            this.puzzleStats.avgTime = {
                minutes: 0,
                seconds: 0.0
            };
            this.puzzleStats.bestMoves = 1000;
            this.puzzleStats.totalMoves = 0;
            this.puzzleStats.averageMoves = 0;
            this.puzzleStats.timesSolved = 0;
            this.puzzleStats.moveScore = 0;
            this.puzzleStats.timeScore = 0;
            this.puzzleStats.bestScore = 0;
        }
    }
    ShowCompletionStats(isTutorial = false) {
        var isNewMovesRecord = false;
        var isNewTimeRecord = false;
        var isNewScore = false;

        this.puzzleStats.timesSolved++;
        this.puzzleStats.totalMoves += this.puzzle.totalMoves;
        this.puzzleStats.averageMoves = Math.round(this.puzzleStats.totalMoves / this.puzzleStats.timesSolved);

        if (this.puzzleStats.bestMoves > this.puzzle.totalMoves) {
            this.puzzleStats.bestMoves = this.puzzle.totalMoves;
            isNewMovesRecord = true;
        }

        this.puzzleStats.totalTime.minutes += this.puzzle.timeToSolveMinutes;
        this.puzzleStats.totalTime.seconds += this.puzzle.timeToSolveSeconds;
        var totalMoves = this.puzzle.totalMoves;
        var timeToSolve = this.puzzle.timeToSolveMinutes + "m " + this.puzzle.timeToSolveSeconds + "s";
        let movesText = document.getElementById("movesToComplete");
        movesText.innerHTML = totalMoves;
        var div_winner = document.getElementById("puzzleOverlay");
        div_winner.style.pointerEvents = "visible";
        div_winner.classList.toggle('show');

        if (this.puzzle.totalMoves > 0) {
            //save data
            localStorage.setItem(this.localStorageRegister, JSON.stringify(this.puzzleStats));
        }

        let canDoBetterMsg = document.getElementById("canDoBetterMessage");
        let winMessage = document.getElementById("winMessage");

        if (totalMoves <= this.puzzle.puzzleDefinition.movesToWin) {
            winMessage.innerHTML = "YOU WIN";
            canDoBetterMsg.innerHTML = "";
            this.puzzleStats.puzzleSolvedInMinimalMoves = true;
        } else {
            winMessage.innerHTML = "";
            canDoBetterMsg.innerHTML = "... but you can do better!";
            this.puzzleStats.puzzleSolvedInMinimalMoves = false;
        }
        return this.puzzleStats;
    }
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
// if (storageAvailable('localStorage')) {
//     console.log("Yippee! We can use localStorage awesomeness");
// }else {
//     console.log("Too bad, no localStorage for us");
// }
