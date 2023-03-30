export function sendMessageToHost(message: any) {
  window.parent.postMessage(
    // @ts-ignore
    JSON.stringify({ ...message, eventID: window.eventID }),
    "*"
  );
}

export function getSequence(n: number, difficulty = 0) {
  let sequence = [];
  let maxNum = 0;
  switch (difficulty) {
    case 0:
      maxNum = 9;
      break;
    case 1:
      maxNum = 99;
      break;
    case 2:
      maxNum = 999;
      break;
    default:
      //"Invalid difficulty level. Please enter a number between 0 and 2."
      maxNum = 9;
  }
  //let sum = 0;
  for (let i = 0; i < n; i++) {
    let num = Math.floor(Math.random() * maxNum * 2 + 1) - maxNum; // generate a random number between 1 and maxNum
    sequence.push(num);
    /*if (Math.sign(sum) === -1) {
      num = Math.abs(num);
    } else if (Math.sign(num) === -1 || (i === 0 && num === 0)) {
      num = Math.abs(num);
    }
    if (sum + num < 0) {
      //|| sum + num < maxNum) {
      num = Math.abs(sum); // absolute value of a number
    }
    if (sum + num > maxNum) {
      num = -num;
    } else if (Math.random() < 0.5 && num <= sum) {
      num = -num;
    }
    sequence.push(num);
    sum += num;*/
  }
  return validateNumbers(sequence, maxNum); // sequence;
}

export function validateNumbers(arrNum: Array<number>, maxNum: number) {
  let sequence = [];
  let sum = 0;
  for (let i = 0; i < arrNum.length; i++) {
    let num = arrNum[i]; // Math.floor(Math.random() * maxNum + 1); // generate a random number between 1 and maxNum
    /*if (Math.sign(sum) === -1) {
      num = Math.abs(num);
    }*/ /*else if (Math.sign(num) === -1) {
      num = Math.abs(num);
    }*/
    if (sum + num < 0) {
      num = Math.abs(sum + num); // absolute value of a number
    } else if (sum + num > maxNum) {
      num = num - sum;
      if (num === 0) {
        num = -1000;
      }
    } /*else if (Math.random() < 0.5 && num <= sum) {
      num = -num;
    }*/
    sequence.push(num);
    sum += num;
  }
  return sequence;
}

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
