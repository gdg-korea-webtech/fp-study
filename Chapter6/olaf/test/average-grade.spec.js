const computeAverageGrade = require("./average-grade");

test("computeAverageGrade 는 받은 점수들을 계산하여 학점을 계산한다", () => {
  expect(computeAverageGrade([80, 90, 100])).toBe("A");
});
