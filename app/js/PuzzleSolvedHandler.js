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


        if (this.puzzleStats.bestTime.minutes * 60 + this.puzzleStats.bestTime.seconds > this.puzzle.timeToSolveMinutes * 60 + this.puzzle.timeToSolveSeconds) {
            this.puzzleStats.bestTime.minutes = this.puzzle.timeToSolveMinutes;
            this.puzzleStats.bestTime.seconds = this.puzzle.timeToSolveSeconds;
            isNewTimeRecord = true;
        }

        var totalTimeInSeconds = this.puzzleStats.totalTime.minutes * 60 + this.puzzleStats.totalTime.seconds;

        var avgTime = Math.round((totalTimeInSeconds / this.puzzleStats.timesSolved) * 100) / 100;

        var avgTimeMinutes = Math.floor(avgTime / 60);
        var avgTimeSeconds = Math.round((avgTime - avgTimeMinutes * 60) * 100) / 100;

        this.puzzleStats.avgTime.minutes = avgTimeMinutes;
        this.puzzleStats.avgTime.seconds = avgTimeSeconds;


        //calculate score
        var puzzleParams = this.puzzle.puzzleDefinition;
        var scoreParams = {
            t0: 20,
            t1: 40,
            t2: 42,
            ct: 0.5,
            m0: 20,
            m1: 40,
            m2: 46,
            cm: 1
        };

        if ("scoreParams" in puzzleParams) {
            scoreParams = puzzleParams.scoreParams;
        }

        var timeToSolveInSeconds = this.puzzle.timeToSolveMinutes * 60 + this.puzzle.timeToSolveSeconds;
        var newTimeScore = scoreParams.t2 - (timeToSolveInSeconds * scoreParams.ct);
        newTimeScore = newTimeScore < scoreParams.t0 ? scoreParams.t0 : newTimeScore > scoreParams.t1 ? scoreParams.t1 : newTimeScore;

        var newMoveScore = scoreParams.m2 - (this.puzzle.totalMoves * scoreParams.cm);
        newMoveScore = newMoveScore < scoreParams.m0 ? scoreParams.m0 : newMoveScore > scoreParams.m1 ? scoreParams.m1 : newMoveScore;

        var newScore = newTimeScore * newMoveScore;
        if (newScore > this.puzzleStats.bestScore) {
            this.puzzleStats.bestScore = newScore;
            isNewScore = true;
        }
        this.puzzle.timeScorePercent = this.puzzleStats.timeScore / scoreParams.t1;
        if (newTimeScore > this.puzzleStats.timeScore) {
            this.puzzleStats.timeScore = newTimeScore;
            this.puzzle.timeScorePercent = newTimeScore / scoreParams.t1;
        }
        this.puzzle.moveScorePercent = this.puzzleStats.moveScore / scoreParams.m1;
        if (newMoveScore > this.puzzleStats.moveScore) {
            this.puzzleStats.moveScore = newMoveScore;
            this.puzzle.moveScorePercent = newMoveScore / scoreParams.m1;
        }
        //display data
        var score = Math.round(newScore);
        var totalMoves = this.puzzle.totalMoves;
        var timeToSolve = this.puzzle.timeToSolveMinutes + "m " + this.puzzle.timeToSolveSeconds + "s";
        var div_winner = document.getElementById("puzzleOverlay");
        div_winner.style.pointerEvents = "visible";
        let movesSpeed = totalMoves / timeToSolveInSeconds;
        this.FillInStats(timeToSolve, totalMoves, score, isNewTimeRecord, isNewMovesRecord, isNewScore, movesSpeed.toFixed(2));
        div_winner.style.opacity = 0.99;
        document.getElementById("mainDiv").style.opacity = 0.05;
        div_winner.classList.toggle('show');

        if (this.puzzle.totalMoves > 0) {
            //save data
            localStorage.setItem(this.localStorageRegister, JSON.stringify(this.puzzleStats));
        }
        return this.puzzleStats;
    }

    FillInStats(time, moves, score, newTimeRecord, newMovesRecord, newScoreRecord, movesSpeed) {
        try {

            let movesText = document.getElementById("movesToComplete");
            movesText.innerHTML = moves;
            //fill in historic stats table
            document.getElementById("histRecentTime").innerHTML = time + "";
            document.getElementById("histRecentMoves").innerHTML = moves + "";
            document.getElementById("histRecentSpeed").innerHTML = movesSpeed + "";
            document.getElementById("histRecentScore").innerHTML = score + "";

        } catch (e) {
            console.log(e);
        }
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
