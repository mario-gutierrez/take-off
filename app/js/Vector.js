class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVector(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    multiply(m) {
        return new Vector(this.x * m, this.y * m);
    }

    divide(d) {
        return new Vector(this.x / d, this.y / d);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        return this.divide(this.magnitude());
    }

    distanceTo(v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }

    vectorTo(v) {
        return new Vector(v.x - this.x, v.y - this.y);
    }
}