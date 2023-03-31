export function sendMessageToHost(message: any) {
  window.parent.postMessage(
    // @ts-ignore
    JSON.stringify({ ...message, eventID: window.eventID }),
    "*"
  );
}

/**
 * @param n
 * @param maxNum
 * @param difficulty Brothers; Easy = 1-> +4; 2=>+3+4 3=> +2+3+4; 4=> +1;+2+3+4; 5=>-1;-2;-3;-4; 6=>-2;-3;-4  (7-> -3;-4) 8=> -4;
 */
export function getSequence(
  n: number,
  maxNum: number = 9,
  difficulty = "Easy"
) {
  let sequence = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    let num; //sequence.push(num);
    if (sum === 0) {
      // Initial
      num = getRandomNumber(1, maxNum);
    } else if (maxNum === sum) {
      num = getRandomNumber(-1, maxNum * -1);
    } else {
      if (Math.random() < 0.5) {
        num = getRandomNumber(-1, sum * -1);
      } else {
        num = getRandomNumber(1, maxNum - sum);
      }
    }
    if (difficulty === "Easy") {
      num = easyProcessor(sum, num);
    }
    sequence.push(num);
    sum += num;
  }
  return sequence; // validateNumbers(sequence, maxNum);
}

export function easyProcessor(sum: number, num: number): number {
  if (sum === 1) {
    if (num === 4) {
      num = 5;
    }
  } else if (sum === 2) {
    if (num === 3) {
      num = 2;
    } else if (num === 4) {
      num = 5;
    }
  } else if (sum === 3) {
    if (num === 2 || num === 3) {
      num = num * -1;
    } else if (num === 4) {
      num = 5;
    }
  } else if (sum === 4) {
    if (num === 1 || num === 2 || num === 3 || num === 4) {
      num = num * -1;
    }
  } else if (sum === 5) {
    if (num === -1 || num === -2 || num === -3 || num === -4) {
      num = num * -1;
    }
  } else if (sum === 6) {
    if (num === -2 || num === -3) {
      num = num * -1;
    } else if (num === -4) {
      num = -5;
    }
  } else if (sum === 7) {
    if (num === -3) {
      num = -1;
    } else if (num === -4) {
      num = -2;
    }
  } else if (sum === 8) {
    if (num === -4) {
      num = -3;
    }
  }
  return num;
}

export function getRandomNumber(min: number, max: number): number {
  const minSign = Math.sign(min);
  const maxSign = Math.sign(max);
  if (minSign === -1 && maxSign === -1) {
    // min < 0 max < 0
    return Math.floor(Math.random() * (max - min)) + min;
  } else if (minSign === 1 && maxSign === 1) {
    // min > 0  max > 0
    return Math.floor(Math.random() * max) + min;
  }
  throw new Error("Range does not allow! use min,max < 0 or min,max > 0");
}

/*export function validateNumbers(arrNum: Array<number>, maxNum: number) {
  let sequence = [];
  let sum = 0;
  for (let i = 0; i < arrNum.length; i++) {
    let num = arrNum[i]; // Math.floor(Math.random() * maxNum + 1); // generate a random number between 1 and maxNum
    /!*if (Math.sign(sum) === -1) {
      num = Math.abs(num);
    }*!/ /!*else if (Math.sign(num) === -1) {
      num = Math.abs(num);
    }*!/
    if (sum + num < 0) {
      num = Math.abs(sum + num); // absolute value of a number
    } else if (sum + num > maxNum) {
      num = num - sum;
      if (num === 0) {
        num = -1000;
      }
    } /!*else if (Math.random() < 0.5 && num <= sum) {
      num = -num;
    }*!/
    sequence.push(num);
    sum += num;
  }
  return sequence;
}*/

/*export function getSequence(n: number, difficulty = 0) {
  let sequence = [];
  let maxNum = 0;
  switch (difficulty) {
    case 0:
      maxNum = 9;
      break;
    case 1:
      maxNum = 20;
      break;
    case 2:
      maxNum = 100;
      break;
    default:
      return 'Invalid difficulty level. Please enter a number between 0 and 2.';
  }
  for (let i = 0; i < n; i++) {
    sequence.push(Math.floor(Math.random() * (maxNum + 1)));
  }
  return sequence;
}*/
