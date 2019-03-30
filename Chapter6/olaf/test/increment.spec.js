const { increment, increment2 } = require("./increment");

test("increment 는 0 에서 1 만큼 증가시킨다.", () => {
  expect(increment()).toBe(1);
});

// test("increment 는 0 에서 1 만큼 증가시킨다.", () => {
//   expect(increment()).toBe(1);
// });

test("increment2 는 받은 숫자에 1 만큼 증가시킨다.", () => {
  expect(increment2(10)).toBe(11);
});

test("increment2 는 받은 숫자에 1 만큼 증가시킨다.", () => {
  expect(increment2(1)).toBe(2);
});
