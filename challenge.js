class Challenge {
    /**
     * @param {Array} vector an array of 0s and 1s which represent the challenge vector
     */
    constructor(vector) {
        while (vector.length < 64) {
            vector.unshift(0);
        }
        this.vector = vector;
        // using BigInt because Javascript can only handle numbers up to 2^53 -_-
        this.value = BigInt("0b" + vector.join(""));
    }

    getBit(position) { // 1-indexed as according to the paper
        return this.vector[position - 1];
    }

    getLength() {
        return this.vector.length;
    }

    getValue() {
        return this.value;
    }

    getString() {
        return this.vector.join("");
    }
}