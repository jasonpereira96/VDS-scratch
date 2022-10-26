class Challenge {
    /**
     * 
     * @param {Number} value an integer value which is the value of this challenge vector
     * The constructor will take a value convert it to binary. The binary form will be stored in this.vector
     */
    constructor(value) {
        let vector = [];
        while (value > 0) {
            let bit = value % 2;
            vector.unshift(bit);
            value = Math.floor(value / 2);
        }
        while (vector.length < 4) {
            vector.unshift(0);
        }
        this.value = value;
        this.vector = vector;
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