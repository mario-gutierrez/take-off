class PuzzleTools {
    static ColorPalette() {
        return {
            mainBgClr: "#f5f7e6",
            puzzleDisableBgClr: "#8d7e8c",
            puzzleBgClr: "#2e010a",
            emptyRingClr: "#dad9d0",
            outterRingClr: "#942193",
            innerRingClr: "#fd068a",
            gridMargin: "#3a7d8d",
            logoCenter: "#3b7c8d",
            logoEdge: "#72dddc",
            logoDot: "#c51b75",
            darkBlueBg: "#041b3e"
        };
    }
    static DrawCircle(ctx, radius, cx, cy, lineWidth, color, angle = 2 * Math.PI) {
        var offsetAngle = -0.5 * Math.PI;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, offsetAngle, angle + offsetAngle, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    static FillCircle(ctx, radius, cx, cy, color) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    static GetQuadratisLogoInCanvas(canvasSize, bgColor, defaultColor = true) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute('width', canvasSize);
        canvas.setAttribute('height', canvasSize);
        var ctx = canvas.getContext('2d');

        this.ScaleCanvas(canvas, ctx, canvasSize, canvasSize);

        var cx = canvasSize * 0.5 - 2;
        var cy = cx;
        var innerRadius = cx * 0.8;
        var dotRadius = canvasSize * 0.06;
        var dotMargin = canvasSize * 0.08;


        var colorPalette = this.ColorPalette();
        var dotCenter = canvasSize - dotMargin - dotRadius * 0.5;

        //background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // //edge
        this.FillCircle(ctx, cx, cx, cy, defaultColor ? colorPalette.logoEdge : colorPalette.logoCenter);
        // //center
        this.FillCircle(ctx, innerRadius, cx, cy, defaultColor ? colorPalette.logoCenter : colorPalette.logoEdge);
        // //dot
        this.FillCircle(ctx, dotRadius, dotCenter, dotCenter, colorPalette.logoDot);

        // center dot: DEBUG
        //this.FillCircle(ctx, dotRadius * 0.2, cx, cy, colorPalette.logoDot);
        return canvas;
    }

    static GetThumbnailInCanvasFromJson(puzzleJson, canvasSize, showEnabled = false, innerPercent = 0, outterPercent = 0, outterRingColor = this.ColorPalette().emptyRingClr) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute('width', canvasSize);
        canvas.setAttribute('height', canvasSize);
        var ctx = canvas.getContext('2d');

        var ringWidth = canvasSize * 0.04;
        var puzzleCircleRadius = 0.5 * canvasSize * 0.8;
        var puzzleSide = Math.cos(0.785398) * puzzleCircleRadius * 2.0;
        var puzzleOffset = (canvasSize - puzzleSide) * 0.5;
        var cx = canvasSize * 0.5;
        var cy = cx;

        var colorPalette = this.ColorPalette();
        //background
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        //puzzle background
        if (showEnabled && innerPercent <= 0) {
            ctx.fillStyle = "rgba(0, 0, 0, 0)"; //puzzleJson.backgroundColor;
            ctx.fillRect(0, 0, canvasSize, canvasSize);
            this.FillCircle(ctx, puzzleCircleRadius + ringWidth * 1.5, cx, cy, puzzleJson.backgroundColor);
            if (outterPercent == 0) {
                this.DrawCircle(ctx, puzzleCircleRadius + ringWidth * 1.5, cx, cy, ringWidth, outterRingColor);
            }
        } else {
            this.FillCircle(ctx, puzzleCircleRadius, cx, cy, showEnabled ? puzzleJson.backgroundColor : colorPalette.puzzleDisableBgClr);
            //rings
            this.DrawCircle(ctx, puzzleCircleRadius + ringWidth * 0.5, cx, cy, ringWidth, outterRingColor);
            this.DrawCircle(ctx, puzzleCircleRadius + ringWidth * 1.5 + 1, cx, cy, ringWidth, outterRingColor);
        }

        //puzzle
        var cellWidth = puzzleJson.rows > puzzleJson.cols ? puzzleJson.rows : puzzleJson.cols;
        cellWidth = Math.floor(puzzleSide / cellWidth);

        for (var row = 0; row < puzzleJson.rows; row++) {
            var puzzleRow = puzzleJson.layout[row];
            for (var col = 0; col < puzzleJson.cols; col++) {
                ctx.fillStyle = showEnabled ? puzzleJson.backgroundColor : colorPalette.puzzleDisableBgClr;
                ctx.fillRect(col * cellWidth + puzzleOffset, row * cellWidth + puzzleOffset, cellWidth, cellWidth);
                ctx.fillStyle = puzzleRow[col] >= 0 ? puzzleJson.colorsTable[puzzleRow[col]] : showEnabled ? puzzleJson.backgroundColor : colorPalette.puzzleDisableBgClr;
                ctx.fillRect(col * cellWidth + 1 + puzzleOffset, row * cellWidth + 1 + puzzleOffset, cellWidth - 2, cellWidth - 2);
            }
        }
        //score rings
        if (!showEnabled) {
            this.DrawCircle(ctx, puzzleCircleRadius, cx, cy, 1, colorPalette.puzzleBgClr);
            //disabled overlay
            var offsetAngle = -0.25 * Math.PI;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(cx, cy, puzzleCircleRadius, offsetAngle, Math.PI + offsetAngle);
            ctx.fillStyle = colorPalette.emptyRingClr;
            ctx.fill();
        } else if (innerPercent > 0 || outterPercent > 0) {
            var arcLength = 2 * Math.PI;
            this.DrawCircle(ctx, puzzleCircleRadius + ringWidth * 0.5, cx, cy, ringWidth, colorPalette.innerRingClr, arcLength * innerPercent);
            this.DrawCircle(ctx, puzzleCircleRadius + ringWidth * 1.5 + 1, cx, cy, ringWidth, colorPalette.outterRingClr, arcLength * outterPercent);
        }
        return canvas;
    }

    static GetPlayIconInCanvas(canvasSize, bgColor) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute('width', canvasSize);
        canvas.setAttribute('height', canvasSize);
        var ctx = canvas.getContext('2d');

        this.ScaleCanvas(canvas, ctx, canvasSize, canvasSize);

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.beginPath();

        var margin = canvasSize * 0.1;
        var center = canvasSize * 0.5;
        var r = center - margin * 2.1;
        ctx.moveTo(center + r, center);
        ctx.lineTo(r * Math.cos(Math.PI * 0.66666) + center,
            r * 0.9 * Math.sin(Math.PI * 0.6666) + center);
        ctx.lineTo(r * Math.cos(Math.PI * 1.33333) + center,
            r * 0.9 * Math.sin(Math.PI * 1.33333) + center);
        ctx.closePath();
        ctx.fillStyle = this.ColorPalette().logoDot;
        ctx.fill();

        var ringWidth = canvasSize * 0.03;

        this.DrawCircle(ctx, canvasSize * 0.5 - margin + ringWidth * 0.5, center, center, ringWidth, this.ColorPalette().emptyRingClr);
        return canvas;
    }

    static SetClickEvent(e, clickFunction) {
        e.addEventListener('mouseup', function(evt) {
            clickFunction();
            evt.preventDefault();
        });

        e.addEventListener('touchend', function(evt) {
            clickFunction();
            evt.preventDefault();
        });
    }

    static ScaleCanvas(canvas, context, width, height) {
        // assume the device pixel ratio is 1 if the browser doesn't specify it
        const devicePixelRatio = window.devicePixelRatio || 1;

        // determine the 'backing store ratio' of the canvas context
        const backingStoreRatio = (
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
        );

        // determine the actual ratio we want to draw at
        const ratio = devicePixelRatio / backingStoreRatio;

        if (devicePixelRatio !== backingStoreRatio) {
            // set the 'real' canvas size to the higher width/height
            canvas.width = width * ratio;
            canvas.height = height * ratio;

            // ...then scale it back down with CSS
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        } else {
            // this is a normal 1:1 device; just scale it simply
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = '';
            canvas.style.height = '';
        }

        // scale the drawing context so everything will work at the higher ratio
        context.scale(ratio, ratio);
    }

    static async ShareData(title, text, url, canvasName) {
        let time = new Date().getTime();
        if (navigator.share) {
            const dataUrl = document.getElementById(canvasName).toDataURL();
            const blob = await (await fetch(dataUrl)).blob();
            const filesArray = [
                new File(
                    [blob],
                    'quadratis' + time + '.png', {
                        type: "image/png",
                        lastModified: new Date().getTime()
                    }
                )
            ];
            const shareData = {
                title: title,
                text: text,
                url: url,
                files: filesArray,
            };
            navigator.share(shareData);
        } else {
            // fallback
            console.log("We need custom implementation of sharing");
        }
    }
}