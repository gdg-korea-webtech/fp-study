const { printHistory, printResult } = require("./print");

describe("로직 테스트", () => {
  test("printHistory", () => {
    const inputValue = 3;
    expect(printHistory(inputValue, "+")).toBe("3 + ");
    expect(printHistory(inputValue, "=")).toBe("3 = ");
  });

  test("printResult", () => {
    expect(printResult("0 =")).toBe(0);
    expect(printResult("3 + 4 + 3 =")).toBe(10);
    expect(printResult("-3 + -4 + -3 =")).toBe(-10);
    expect(printResult("-3 + 3 =")).toBe(0);
  });
});
