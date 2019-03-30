const R = require("ramda");

function fork(join, func1, func2) {
  return function(value) {
    return join(func1(value), func2(value));
  };
}

function toLetterGrade(grade) {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

module.exports = R.compose(
  toLetterGrade,
  fork(R.divide, R.sum, R.length)
);
