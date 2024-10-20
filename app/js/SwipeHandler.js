class SwipeHandler {
    constructor(minSwipeDistance, callback, puzzle) {
        this.minSwipeDistance = minSwipeDistance;
        this.startPoint = new Vector(0, 0);
        this.endPoint = new Vector(0, 0);
        this.swipeDirection = CardinalPoints.UP;
        this.callbackFunc = callback;
        this.swipeStarted = false;
        this.puzzle = puzzle;
    }
    minSwipeDistanceAchieved(point) {
        var d = this.startPoint.distanceTo(point);
        //console.log("distance: " + d);
        return (d > this.minSwipeDistance);
    }
    getSwipeDirection(endPoint) {
        this.endPoint = endPoint;
        var dx = endPoint.x - this.startPoint.x;
        var dy = endPoint.y - this.startPoint.y;
        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx < 0) {
                return CardinalPoints.LEFT;
            } else {
                return CardinalPoints.RIGHT;
            }
        } else {
            if (dy < 0) {
                return CardinalPoints.UP;
            } else {
                return CardinalPoints.DOWN;
            }
        }
    }
    processMovement(point) {
        if (this.swipeStarted && this.minSwipeDistanceAchieved(point)) {
            this.callbackFunc(this.getSwipeDirection(point), this.startPoint, this.puzzle);
            this.swipeStarted = false;
        }
    }
}