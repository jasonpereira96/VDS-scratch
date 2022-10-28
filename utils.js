
function getRandomNumber() {
  let randomNumber = Math.random() * 2 - 1;
  return randomNumber;
}

function sign(value) {
  return value < 0 ? -1 : 1;
}

function getPufData(pufs, challenges) {
  let res = [];
  for (let challangeId = 0; challangeId < challenges; challangeId++) {
    let datum = {};
    datum.values = [];
    for (let puf = 0; puf < pufs; puf++) {
      let r = getRandomNumber();
      datum.values.push(r);
      datum[puf] = r;
    }
    res.push({
      challangeId, 
      pufValues: datum
    });
  }
  return res;
}

function generateResponseMatrix() {
  let pufs = [];
  for (let p=0; p<8; p++) {
    pufs.push(new PUF(4));
  }
  let m = [];
  for (let c=0; c<8; c++) {
    let responses = [];
    for (let puf of pufs) {
      responses.push(puf.getResponse(new Challenge(c)));
    }
    m.push(responses);
  }
  return m;
}

function isEven(value) {
  return value % 2 === 0;
}

function isOdd(value) {
  return value % 2 === 1;
}

function toBinaryVector(value) {
  let digits = [];
  while (value > 0) {
    let digit = value % 2;
    digits.unshift(digit);
    value = value >>> 1;
  }
  const L = Math.log2(N - 1);
  while (digits.length < L) {
    digits.unshift(0);
  }
  return digits;
}

function toBinaryString(value) {
  return toBinaryVector(value).join("");
}
