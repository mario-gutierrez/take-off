var CardinalPoints = {
    "UP": 0,
    "DOWN": 1,
    "LEFT": 2,
    "RIGHT": 3
};

class BlockLinks{
    constructor(){
        this.left = -1;
        this.right = -1;
        this.top = -1;
        this.bottom = -1;
    }   
}

class Block {
    constructor(type, row, col) {
        this.type = type;
        this.links = new BlockLinks();
        this.animationDir = CardinalPoints.UP;
        this.animationLinks = new BlockLinks();
        this.row = row;
        this.col = col;
        this.links.top = null;
        this.links.bottom = null;
        this.links.left = null;
        this.links.right = null;
    }

    getBlockAt(direction) {
        switch (direction) {
            case CardinalPoints.UP:
                return this.links.top;
            case CardinalPoints.DOWN:
                return this.links.bottom;
            case CardinalPoints.LEFT:
                return this.links.left;
            case CardinalPoints.RIGHT:
                return this.links.right;
        }
        return null;
    }

    resetAnimationLinks(){
        this.animationLinks.top = -1;
        this.animationLinks.bottom = -1;
        this.animationLinks.left = -1;
        this.animationLinks.right = -1;
    }

    setAnimationLinkAt(direction, type) {
        switch (direction) {
            case CardinalPoints.UP:
                    if (this.animationLinks.top == -1){
                        this.animationLinks.top = type;
                    }
                break;
            case CardinalPoints.DOWN:
                    if (this.animationLinks.bottom == -1){
                        this.animationLinks.bottom = type;
                    }
                break;
            case CardinalPoints.LEFT:
                    if (this.animationLinks.left == -1){
                        this.animationLinks.left = type;
                    }
                break;
            case CardinalPoints.RIGHT:
                    if (this.animationLinks.right == -1){
                        this.animationLinks.right = type;
                    }
                break;
        }
    }

    getPreviousColorAndDirection(){
        var r ={oldColor:"#000000",animDirX:0,animDirY:0};
        if (this.animationLinks.top >=0){
            r.oldColor = this.animationLinks.top;
            r.animDirX = 0;
            r.animDirY = 1.0;
            return r;
        }
        if (this.animationLinks.bottom >=0){
            r.oldColor = this.animationLinks.bottom;
            r.animDirX = 0;
            r.animDirY = -1.0;
            return r;
        }
        if (this.animationLinks.left >=0){
            r.oldColor = this.animationLinks.left;
            r.animDirX = 1.0;
            r.animDirY = 0;
            return r;
        }
        if (this.animationLinks.right >=0){
            r.oldColor = this.animationLinks.right;
            r.animDirX = -1.0;
            r.animDirY = 0;
            return r;
        }
        return r;
    }
}

class BlocksEngine{
    constructor (_blocks){
        this.blocks = _blocks;
    }

    getInverseDirection(direction) {
        switch (direction) {
            case CardinalPoints.UP:
                return CardinalPoints.DOWN;
            case CardinalPoints.DOWN:
                return CardinalPoints.UP;
            case CardinalPoints.LEFT:
                return CardinalPoints.RIGHT;
            case CardinalPoints.RIGHT:
                return CardinalPoints.LEFT;
        }
    }

    getDirectionName(direction) {
        switch (direction) {
            case CardinalPoints.UP:
                return "UP";
            case CardinalPoints.DOWN:
                return "DOWN";
            case CardinalPoints.LEFT:
                return "LEFT";
            case CardinalPoints.RIGHT:
                return "RIGHT";
        }
    }

    printData() {
        for (var i = 0; i < this.blocks.length; i++) {
            console.log(i+": t:"+this.blocks[i].type+" row:"+this.blocks[i].row+" col:"+this.blocks[i].col);
        }
    }
    
    shift(index, direction) {
        var blockChain = [];
        for (let b of this.blocks){
            b.resetAnimationLinks();
        }

        var b = this.blocks[index];
        var start = b;
        var end = b.getBlockAt(this.getInverseDirection(direction));
        
        if (end != null && end.type >= 0){
            var newType = end.type;
            end.setAnimationLinkAt(this.getInverseDirection(direction), end.type);
            do {
                var oldValue = b.type;            
                b.setAnimationLinkAt(this.getInverseDirection(direction), oldValue);
                b.type = newType;
                blockChain.push(b);
                b = b.getBlockAt(direction);
                newType = oldValue;
            } while (b != null && b != start);
        }else{
            console.log(`shift index:${index} value: ${b.type} dir: ${direction} was null or invalid value!!`);
        }
        return blockChain;
    }

    getCurrentState(){
        var currentState = [];
        for (var i = 0; i < this.blocks.length; i++) {            
            currentState.push(this.blocks[i].type);
        }
        return currentState;
    }

    newStateAfterShift(index, direction){
        //console.log("newStateAfterShift: "+index+", "+direction);
        var newConfig = [];
        var previousState = this.getCurrentState();
        var b = this.blocks[index];
        if (b.type >= 0) {
            var start = b;
            var end = b.getBlockAt(this.getInverseDirection(direction));            
            if (end != null && end.type >=0) {
                var newType = end.type;
                var maxIterations = 100;
                var iteration = 0;
                do {
                    var oldValue = b.type;
                    b.type = newType;
                    b = b.getBlockAt(direction);
                    newType = oldValue;
                    iteration++;
                } while (iteration < maxIterations && b != null && b.type >=0 && b != start);

                for (var i = 0; i < this.blocks.length; i++) {
                    newConfig.push(this.blocks[i].type);
                    this.blocks[i].type = previousState[i];
                }
            }
        }
        return newConfig;
    }
}