import { getRandomNumber, processNumbers } from "../utils";
const { getSequence } = require("../utils");

it("sequence", () => {
  for (let i = 0; i < 10; i++) {
    const seq = getSequence(100, 9);
    console.log(JSON.stringify(seq));
    const sum = seq.reduce((a, b) => a + b);
    // expect(seq.length).toEqual(10);
    expect(sum).toBeGreaterThanOrEqual(0);
  }
});

/*it("random", () => {
  const seq = [];
  for (let i = 0; i < 100; i++) {
    seq.push(getRandomNumber(1, 9));
  }
  for (let i = 0; i < 100; i++) {
    seq.push(getRandomNumber(-1, -9));
  }
  console.log(JSON.stringify(seq));
});*/
/*it("get sequence", () => {
  for (let i = 0; i < 10; i++) {
    const seq = getSequence(10, 0);
    console.log(JSON.stringify(seq));
    const sum = seq.reduce((a, b) => a + b);
    expect(seq.length).toEqual(10);
    expect(sum).toBeGreaterThanOrEqual(0);
  }
});*/

/*it("process sequence", () => {
  const seq = [2, -4, 0];
  const processed = processNumbers(seq, 9);
  console.log(JSON.stringify(processed));
  const sum = processed.reduce((a, b) => a + b);
  expect(sum).toBeGreaterThanOrEqual(0);
});*/
