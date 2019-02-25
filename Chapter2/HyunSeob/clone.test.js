const clone = require("./clone");

describe("my clone", () => {
  test("Object", () => {
    const original = {
      foo: {}
    };
    const copy = clone(original);

    expect(copy).not.toBe(original);
    expect(copy).toEqual(original);
    expect(copy.foo).toBe(original.foo);
    expect(copy.foo).toEqual(original.foo);
  });

  test("Array", () => {
    const original = [{}, 1, "string"];
    const copy = clone(original);

    expect(copy).not.toBe(original);
    expect(copy).toEqual(original);
  });

  test("String", () => {
    const original = "string";
    const copy = clone(original);

    expect(copy).toBe(original);
    expect(copy).toEqual(original);
  });

  test("Symbol", () => {
    const original = Symbol("symbol");
    const copy = clone(original);

    expect(copy).toBe(original);
    expect(copy).toEqual(original);
  });
});
