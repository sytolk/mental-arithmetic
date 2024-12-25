/**  Helper functions */
export function getParameterByName(paramName: string) {
  const name = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  // @ts-ignore
  const results = regex.exec(window.location.search);
  let param =
    results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  if (param.includes("#")) {
    param = param.split("#").join("%23");
  }
  return param;
}

export function sendMessageToHost(message: any) {
  const eventID = getParameterByName("eventID");
  window.parent.postMessage(
    JSON.stringify({ ...message, eventID: eventID }),
    "*"
  );
}

/**
 * @param n
 * @param maxNum
 * @param difficulty Brothers; Easy = 1-> +4; 2=>+3+4 3=> +2+3+4; 4=> +1;+2+3+4; 5=>-1;-2;-3;-4; 6=>-2;-3;-4  (7-> -3;-4) 8=> -4;
 * @param duplicates
 */
export function getSequence(
  n: number,
  maxNum: number = 9,
  difficulty = "Easy",
  duplicates = true
): number[] {
  let sequence = [];
  let sum = 0;
  let lastSec = undefined;
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
      num = easyProcessNumber(sum, num);
    }
    if (duplicates || lastSec !== num) {
      lastSec = num;
      sequence.push(num);
      sum += num;
    } else {
      i--;
    }
  }
  return sequence; // validateNumbers(sequence, maxNum);
}

// Function to convert a number into an array of its digits
function getDigitsArray(number: number) {
  return Array.from(String(number), Number);
}

function easyProcessNumber(sum: number, num: number): number {
  const numSign = Math.sign(num);
  const numberArray = getDigitsArray(Math.abs(num));
  const sumArray = getDigitsArray(sum);
  if (numberArray.length > 1) {
    let num = "";
    for (let i = 0; i < numberArray.length; i++) {
      const currentSum = sumArray[i] ? sumArray[i] : 0;
      num = num + Math.abs(easyProcessor(currentSum, numberArray[i] * numSign));
    }
    return parseInt(num, 10) * numSign;
  } else {
    return easyProcessor(sum, num);
  }
}

function easyProcessor(sum: number, num: number): number {
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
