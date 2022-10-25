class PUF {
  constructor(stages = 4) {
    this.stages = stages;
    let deltas = [];

    const mean = 0;
    const variance = 1;
    const distribution = gaussian(mean, variance);
    const randoms = distribution.random(2 * stages);

    for (let i=0; i<2*stages; i += 2) {
      deltas.push({
        0: randoms[i],
        1: randoms[i + 1]
      });
    }
    this.deltas = deltas;
    // this.responses = [];
    // for (let i = 0; i < 256; i++) {
    //   this.responses.push(0);
    // }
  }

  getDelta(position) { // 1-indexed
    return this.deltas[position - 1];
  }
  getDelta0(position) { // 1-indexed
    return this.getDelta(position)[0];
  }
  getDelta1(position) { // 1-indexed
    return this.getDelta(position)[1];
  }
  getResponse(challenge) {
    return sign(this.getResponseValue(challenge));
  }
  getResponseValue(challenge) {
    const n = challenge.getLength();
    return this.response(challenge, n);
  }
  // internal
  response(challenge, position) {
    if (position === 0) {
      return 0;
    }
    const bitValue = challenge.getBit(position);
    if (bitValue === 0) {
      return this.response(challenge, position - 1) + this.getDelta0(position);
    } else if (bitValue === 1) {
      return (-1) * this.response(challenge, position - 1) + this.getDelta1(position);
    } else {
      throw new Error("something went wrong");
    }
  }
}
