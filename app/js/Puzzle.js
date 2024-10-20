class Puzzle {
    constructor(ctx, canvas, puzzleDefinition, displayConfig, playerId = "PlayerOne", gameMode = "Single") {
        this.width = canvas.width;
        this.height = canvas.height;
        this.columns = puzzleDefinition.cols;
        this.rows = puzzleDefinition.rows;
        this.displayConfig = displayConfig;
        this.blocks = [];
        this.goalBlocks = [];
        this.ctx = ctx;
        this.canvas = canvas;
        this.puzzleDefinition = puzzleDefinition;
        this.renderer = 0;
        this.swiping = false;
        this.swipeTimer = 0;
        this.puzzleIsSolved = true;
        this.puzzleName = "Puzzle Name";
        this.totalMoves = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.timeToSolveMinutes = 0;
        this.timeToSolveSeconds = 0;
        this.playerId = playerId;
        this.gameMode = gameMode; //Single, VS, Collab
        //if set to true, puzzle can't keep working after solved
        this.preventMovesAfterSolved = true;
        //keep a log of moves done on this puzzle
        this.movesLog = [];
        this.puzzleSolvedCallback = function() {
            console.log("Puzzle solved!");
        };
        this.puzzleScrambledCallback = function() {
            console.log("Puzzle scrambled, ready to play!");
        };
        this.puzzleMovedCallback = function() {};

        this.tapCallback = function() {
            console.log("tap on puzzle, no further actions");
        };

        this.handleTap = function(self) {
            self.tapCallback();
        };

        this.initBoard();

        this.prepActionsOnTap = function(self) {
            console.log("no prep actions on tap");
        };

        this.furtherActionsOnTap = function(self) {
            console.log("no further action on tap");
        };
    }

    setBorderColor(color) {
        this.renderer.borderColor = color;
    }

    initBoard() {
        for (let t = 1; t < 99999; t++) {
            window.clearInterval(t);
            clearInterval(t);
        }

        for (let row = 0; row < this.puzzleDefinition.layout.length; row++) {
            let blockRow = this.puzzleDefinition.layout[row];
            for (let col = 0; col < blockRow.length; col++) {
                let colorIndex = blockRow[col];
                let b = new Block(colorIndex, row, col);
                this.blocks.push(b);
                this.goalBlocks.push(colorIndex);
            }
        }

        for (let blockLinks of this.puzzleDefinition.links) {
            //block index in links array is valid
            if (blockLinks.id >= 0 && blockLinks.id < this.blocks.length) {
                let block = this.blocks[blockLinks.id];

                //assign links 
                block.links.top = this.blocks[blockLinks.tblr[0]];
                block.links.bottom = this.blocks[blockLinks.tblr[1]];
                block.links.left = this.blocks[blockLinks.tblr[2]];
                block.links.right = this.blocks[blockLinks.tblr[3]];
            }
        }

        this.blocksEngine = new BlocksEngine(this.blocks);
        this.renderer = new PuzzleRenderer(this, this.ctx, this.displayConfig.top, this.displayConfig.left,
            this.rows, this.columns, this.displayConfig.squareSize, this.displayConfig.borderSize, this.displayConfig.borderColor, this.displayConfig.colors);

        this.renderer.render(this.blocksEngine.blocks, this.ctx);

        // let r = this.renderer;
        let processSwipe = function(dir, startPoint, self) {
            if (self.renderer.animating || (self.puzzleIsSolved && self.preventMovesAfterSolved)) return;

            clearInterval(self.swipeTimer);
            let i = self.renderer.getBlockIndexFrom2dPoint(startPoint);
            if (i >= 0) {
                if (self.totalMoves == 0) {
                    //start counting time to solve at first move
                    self.startTime = new Date();
                }
                let blockChain = self.blocksEngine.shift(i, dir);
                self.getNextPossibleStates();
                self.renderer.deltaAnim = 0.05;
                self.renderer.startAnimation(blockChain);
                self.totalMoves++;
                //log move applied
                self.movesLog.push({
                    "block": i,
                    "dir": dir
                });
                self.puzzleMovedCallback();
            }
        };
        this.swipeHandler = new SwipeHandler(this.displayConfig.squareSize / 2, processSwipe, this);
        setCanvasListeners(this, this.swipeHandler, this.handleTap);
    }

    renderSolvedPuzzle(canvasContext) {
        this.renderer.render(this.blocksEngine.blocks, canvasContext);
    }

    renderPuzzleBorders(canvasContext) {
        this.renderer.renderBorders(this.blocksEngine.blocks, canvasContext);
    }

    checkIfSolved() {
        if (this.swiping || this.puzzleIsSolved) {
            return; //do not validate puzzle while scrambling or when it has been solved already
        }

        for (let i = 0; i < this.blocks.length; i++) {
            if (this.goalBlocks[i] != this.blocks[i].type) {
                return; //puzzle is not solved
            }
        }
        this.puzzleIsSolved = true;
        this.endTime = new Date();
        let msToSolve = this.endTime - this.startTime;
        let sToSolve = msToSolve / 1000;
        this.timeToSolveMinutes = Math.floor(sToSolve / 60);
        this.timeToSolveSeconds = Math.round((sToSolve - this.timeToSolveMinutes * 60) * 100) / 100;

        this.puzzleSolvedCallback();
    }

    setPuzzleReadyToPlay(self) {
        if (self.puzzleIsSolved) {
            if (!('defaultScramble' in self.puzzleDefinition)) {
                self.puzzleDefinition.defaultScramble = -1;
                self.puzzleDefinition.randomMoves = 10;
            }

            if (self.puzzleDefinition.defaultScramble == -1) {
                self.scramble(self.puzzleDefinition.randomMoves, 0.1);
                return;
            }

            if (!('defaultScrambleSequence' in self.puzzleDefinition)) {
                let puzzleDefinition = self.puzzleDefinition;
                let scrambles = [{ "puzzleName": "Take Off III", "scramble": [{ "block": 2, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 3, "dir": 2 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 7, "dir": 1 }, { "block": 7, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 2, "dir": 2 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 4, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 3, "dir": 2 }, { "block": 2, "dir": 1 }, { "block": 2, "dir": 3 }] }];
                let scrambleSequences = [];
                scrambles.forEach(function(element) {
                    if (element.puzzleName == puzzleDefinition.puzzleName) {
                        scrambleSequences.push(element.scramble);
                        //console.log(element);
                    }
                });
                puzzleDefinition.defaultScrambleSequence = scrambleSequences[puzzleDefinition.defaultScramble];
                self.scrambleWithSequence(self.puzzleDefinition.defaultScrambleSequence, 0.1);

            } else {
                self.scrambleWithSequence(self.puzzleDefinition.defaultScrambleSequence, 0.1);
            }
        }
    }

    scramble(_movements, _deltaAnim) {
        if (this.swiping) {
            // console.log("Already scrambling...");
            return;
        }
        this.totalMoves = 0;
        this.swiping = true;
        this.renderer.deltaAnim = _deltaAnim;
        this.swipeMovementsApplied = 0;
        this.swipeMovements = _movements;
        const msPerFrame = 20.0; //assuming 60fps rendering
        this.swipeTimer = setInterval(this.doScramble, (1.0 / this.renderer.deltaAnim) * msPerFrame, this);
    }

    doScramble(self) {
        let startBlockIndex = 0;
        let blockChain = [];
        let dir = 0;
        let maxIterations = 100;
        let iteration = 0;
        do {
            startBlockIndex = Math.floor(Math.random() * (self.columns * self.rows));
            dir = Math.floor(Math.random() * 4);
            let startBlock = self.blocksEngine.blocks[startBlockIndex];
            if (startBlock.type >= 0) {
                blockChain = self.blocksEngine.shift(startBlockIndex, dir);
            }
            iteration++;
        } while (blockChain.length <= 1 && iteration < maxIterations);

        if (blockChain.length > 1) {
            self.renderer.startAnimation(blockChain);
            self.swipeMovementsApplied++;
        } else {
            console.log("could not find blockchains longer than 1, avoiding shuffle");
            self.swipeMovementsApplied = self.swipeMovements;
        }

        if (self.swipeMovementsApplied == self.swipeMovements) {
            self.setPuzzleReadyToStart(self);
            self.puzzleScrambledCallback();
        }
    }

    scrambleWithSequence(moveSequence, _deltaAnim) {
        if (moveSequence && moveSequence.length > 0) {
            if (this.swiping) {
                // console.log("Already scrambling...");
                return;
            }
            this.totalMoves = 0;
            this.swiping = true;
            this.renderer.deltaAnim = _deltaAnim;
            this.swipeMovementsApplied = 0;
            this.swipeMovements = moveSequence.length;
            this.swipeSequenceToApply = moveSequence;
            const msPerFrame = 20.0; //assuming 60fps rendering
            this.swipeTimer = setInterval(this.doPredefinedScramble, (1.0 / _deltaAnim) * msPerFrame, this);
        } else {
            console.log("Failed to scramble, moveSequence is empty or undefined");
        }
    }

    doPredefinedScramble(self) {
        let move = self.swipeSequenceToApply[self.swipeMovementsApplied];

        let blockChain = self.blocksEngine.shift(move.block, move.dir);

        if (blockChain.length > 1) {
            self.renderer.startAnimation(blockChain);

            self.swipeMovementsApplied++;
        } else {
            console.log("could not find blockchains longer than 1, avoiding shuffle");
            self.swipeMovementsApplied = self.swipeMovements;
        }

        if (self.swipeMovementsApplied == self.swipeMovements) {
            self.setPuzzleReadyToStart(self);
            self.puzzleScrambledCallback();
        }
    }

    resetPuzzleToGoalState() {
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].type = this.goalBlocks[i];
        }
        this.setPuzzleReadyToStart(this);
        this.renderer.render(this.blocks, this.ctx);
    }

    setPuzzleReadyToStart(self) {
        clearInterval(self.swipeTimer);
        self.renderer.deltaAnim = 0.05;
        self.swiping = false;
        self.puzzleIsSolved = false;
        this.movesLog = [];
        //self.socket.emit('puzzle_graph', { msg: 'startGraph', player: this.playerId, mode: this.gameMode, puzzle: this.puzzleDefinition });
        self.getNextPossibleStates();
    }

    preventStopAfterSolved() {
        this.preventMovesAfterSolved = false;
        this.setPuzzleReadyToStart(this);
    }

    getNextPossibleStates() {
        let currentState = this.blocksEngine.getCurrentState().toString();
        for (let c = 0; c < this.blocksEngine.blocks.length; c++) {
            for (let d = 0; d < 4; d++) {
                let newConfig = this.blocksEngine.newStateAfterShift(c, d).toString();
                if (newConfig.length > 0 && newConfig != currentState) {
                    //this.socket.emit('puzzle_graph', { msg: 'addEdge', current_state: currentState, new_config: newConfig, player: this.playerId, mode: this.gameMode });
                }
            }
        }
        //this.socket.emit('puzzle_graph', { msg: 'setCurrentNode', current_state: currentState, player: this.playerId, mode: this.gameMode });
    }
}