function printHistory(inputValue, operator) {
  const template = operator === "=" ? `${inputValue} = ` : `${inputValue} + `;
  return template;
}

function printResult(expression) {
  const sum = expression
    .trim()
    .split(" ")
    .reduce((accumulator, currentValue, currentIndex) => {
      return (accumulator += currentIndex % 2 ? 0 : parseInt(currentValue));
    }, 0);
  return sum;
}

module.exports = { printHistory, printResult };
