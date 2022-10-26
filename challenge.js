class Challenge {
    /**
     * 
     * @param {Number} value an integer value which is the value of this challenge vector
     * The constructor will take a value convert it to binary. The binary form will be stored in this.vectorexe
     */
    constructor(vector) {
        while (vector.length < 64) {
            vector.unshift(0);
        }
        this.vector = vector.map(d => parseInt(d, 2));

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