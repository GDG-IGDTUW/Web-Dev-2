export function generateRandomNumber(difficulty) {
  let maxNumber;

  switch (difficulty) {
    case "easy":
      maxNumber = 100;
      break;
    case "medium":
      maxNumber = 500;
      break;
    case "hard":
      maxNumber = 1000;
      break;
    default:
      maxNumber = 100;
      break;
  }

  return Math.floor(Math.random() * maxNumber) + 1;
}


export const generateHint = (number) => {
  let hints = [];

  if (number % 2 === 0) {
    hints.push("The number is even.");
  } else {
    hints.push("The number is odd.");
  }

  if (number % 3 === 0) {
    hints.push("It's divisible by 3.");
  }
  if (number % 5 === 0) {
    hints.push("It's divisible by 5.");
  }
  if (number % 7 === 0) {
    hints.push("It's divisible by 7.");
  }

  if (number <= 5) {
    hints.push("The number is 5 or smaller.");
  } else {
    hints.push("The number is greater than 5.");
  }

  if (number <= 25) {
    hints.push("The number is 25 or smaller.");
  } else if (number <= 50) {
    hints.push("The number is between 26 and 50.");
  } else if (number <= 75) {
    hints.push("The number is between 51 and 75.");
  } else {
    hints.push("The number is between 76 and 100.");
  }

  if (Math.sqrt(number) % 1 === 0) {
    hints.push("The number is a perfect square.");
  }
  if (number.toString().length === 1) {
    hints.push("The number is a single digit.");
  }
  if (number.toString().length === 2) {
    hints.push("The number is a double digit.");
  }

  //   Randomly select one hint to make it more challenging
  return hints[Math.floor(Math.random() * hints.length)];
};
