class PuzzleRenderer {
    constructor(puzzleHandler, ctx, top, left, rows, columns, blockSize, borderSize, borderColor, colors) {
        this.puzzleHandler = puzzleHandler;
        this.context = ctx;
        this.top = top;
        this.left = left;
        this.rows = rows;
        this.columns = columns;
        this.blockSize = blockSize;
        this.borderSize = borderSize;
        this.borderColor = borderColor;
        this.colors = colors;
        this.halfBlockSize = blockSize / 2;
        this.deltaAnim = 0.05;
        this.currentAnimOffset = 0;
        this.animationTimer = null;
        this.animating = false;
    }

    getBlockIndexFrom2dPoint(p) {
        if (p.x > this.left && p.x < (this.columns * this.blockSize + this.left) &&
            p.y > this.top && p.y < (this.rows * this.blockSize + this.top)) {
            var x = p.x - this.left;
            var y = p.y - this.top;
            var ix = Math.floor(x / (this.blockSize - this.borderSize));
            var iy = Math.floor(y / (this.blockSize - this.borderSize));
            return iy * this.columns + ix;
        }
        return -1;
    }

    drawSquare(x, y, color, canvasContext) {
        var border = this.borderSize;
        var xcoord = this.left + x * (this.blockSize - border);
        var ycoord = this.top + y * (this.blockSize - border);
        canvasContext.fillStyle = this.borderColor;
        canvasContext.fillRect(xcoord, ycoord, this.blockSize, this.blockSize);
        canvasContext.fillStyle = color;
        canvasContext.fillRect(xcoord + border, ycoord + border, this.blockSize - border * 2, this.blockSize - border * 2);
    }

    drawBorders(x, y, color, canvasContext) {
        var border = this.borderSize;
        var xcoord = this.left + x * (this.blockSize - border);
        var ycoord = this.top + y * (this.blockSize - border);
        canvasContext.fillStyle = "rgba(0,0,0,0)";
        canvasContext.fillRect(xcoord, ycoord, this.blockSize, this.blockSize);
        canvasContext.fillStyle = color;
        canvasContext.fillRect(xcoord + border, ycoord + border, this.blockSize - border * 2, border * 2);
        canvasContext.fillRect(xcoord + border, ycoord + border, border * 2, this.blockSize - border * 2);
        canvasContext.fillRect(xcoord + border, ycoord + this.blockSize - border * 3, this.blockSize - border * 2, border * 2);
        canvasContext.fillRect(xcoord + this.blockSize - border * 3, ycoord + border, border * 2, this.blockSize - border * 2);
    }

    drawAnimatedSquare(_x, _y, newColor, oldColor, xPercentOffset, yPercentOffset) {
        var border = this.borderSize;
        var xcoord = this.left + _x * (this.blockSize - border);
        var ycoord = this.top + _y * (this.blockSize - border);
        var borderColor = this.borderColor;
        var size = this.blockSize - border * 2;

        var x = xcoord;
        var y = ycoord + border;
        var xOffset = Math.abs(this.blockSize * xPercentOffset);

        if (xPercentOffset > 0) {
            this.context.fillStyle = newColor;
            this.context.fillRect(x, y, xOffset, size);

            this.context.fillStyle = oldColor;
            this.context.fillRect(x + xOffset, y, this.blockSize - xOffset, size);

            this.context.fillStyle = borderColor;
            if (xPercentOffset >= 1.0) {
                this.context.fillRect(x, ycoord, border, this.blockSize);
                this.context.fillRect(x + xOffset - border, ycoord, border, this.blockSize);
            } else {
                this.context.fillRect(x + xOffset - border, ycoord, border, this.blockSize);
            }
        }

        if (xPercentOffset < 0) {
            this.context.fillStyle = newColor;
            this.context.fillRect(x + this.blockSize - xOffset, y, xOffset, size);

            this.context.fillStyle = oldColor;
            this.context.fillRect(x, y, this.blockSize - xOffset, size);

            this.context.fillStyle = borderColor;
            if (xPercentOffset <= -1.0) {
                this.context.fillRect(x, ycoord, border, this.blockSize);
                this.context.fillRect(x + this.blockSize - border, ycoord, border, this.blockSize);
            } else {
                this.context.fillRect(x + this.blockSize - xOffset - border, ycoord, border, this.blockSize);
            }

        }

        x = xcoord + border;
        y = ycoord;
        var yOffset = Math.abs(this.blockSize * yPercentOffset);

        if (yPercentOffset > 0) {
            this.context.fillStyle = newColor;
            this.context.fillRect(x, y, size, yOffset);

            this.context.fillStyle = oldColor;
            this.context.fillRect(x, y + yOffset, size, this.blockSize - yOffset);

            this.context.fillStyle = borderColor;
            if (yPercentOffset >= 1.0) {
                this.context.fillRect(xcoord, y, this.blockSize, border);
                this.context.fillRect(xcoord, y + yOffset - border, this.blockSize, border);
            } else {
                this.context.fillRect(xcoord, y + yOffset - border, this.blockSize, border);
            }
        }

        if (yPercentOffset < 0) {
            this.context.fillStyle = newColor;
            this.context.fillRect(x, y + this.blockSize - yOffset, size, yOffset);

            this.context.fillStyle = oldColor;
            this.context.fillRect(x, y, size, this.blockSize - yOffset);

            this.context.fillStyle = borderColor;
            if (yPercentOffset <= -1.0) {
                this.context.fillRect(xcoord, y, this.blockSize, border);
                this.context.fillRect(xcoord, y + this.blockSize - border, this.blockSize, border);
            } else {
                this.context.fillRect(xcoord, y + this.blockSize - yOffset - border, this.blockSize, border);
            }
        }
    }

    render(blocks, canvasContext) {
        for (let block of blocks) {
            if (block.type >= 0) {
                var x = block.col;
                var y = block.row;
                this.drawSquare(x, y, this.colors[block.type], canvasContext);
            }
        }
    }

    renderBorders(blocks, canvasContext) {
        for (let block of blocks) {
            if (block.type >= 0) {
                var x = block.col;
                var y = block.row;
                this.drawBorders(x, y, this.colors[block.type], canvasContext);
            }
        }
    }

    renderAnimated(blocks, animOffset) {        
        for (let block of blocks) {
            if (block.type >= 0) {
                var x = block.col;
                var y = block.row;
                var animParams = block.getPreviousColorAndDirection();
                this.drawAnimatedSquare(x, y,
                    this.colors[block.type],
                    this.colors[animParams.oldColor],
                    animParams.animDirX * animOffset,
                    animParams.animDirY * animOffset);
            }
        }
    }

    animate(timestamp) {        
        this.currentAnimOffset += this.deltaAnim;
        this.currentAnimOffset = (this.currentAnimOffset * 100) / 100.0;
        if (this.currentAnimOffset > (1.01)) {
            this.animating = false;
            this.puzzleHandler.checkIfSolved();
        } else {
            this.renderAnimated(this.blocks, this.currentAnimOffset);
            window.requestAnimationFrame(this.animate);
        }
    }

    startAnimation(_blocks) {
        this.currentAnimOffset = 0.0;
        this.blocks = _blocks;
        this.animating = true;
        this.animate = this.animate.bind(this);
        window.requestAnimationFrame(this.animate);
    }
}