import { fireEvent, waitForDomChange } from "dom-testing-library";

beforeEach(() => {
  document.body.innerHTML = `
    <div id="app">
      <div class="header">
        <div id="history"></div>
        <div id="result"></div>
      </div>
      <div class="body">
        <div id="control">
          <input id="number-input" type="number" value=0>
          <button id="btn-add" type="button">+</button>
          <button id="btn-result" type="button">=</button>
        </div>
      </div>
    </div>
  `;

  require("./calculator");
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("input: 0 = / output: 0", async () => {
  testCalculator("0", "0");
});

test("input: 3 + 4 + 3 = / output: 10", async () => {
  testCalculator("3 + 4 + 3", "10");
});

test("input: -3 + -4 + -3 = / output: -10", async () => {
  testCalculator("-3 + -4 + -3", "-10");
});

test("input: -3 + 3 = / output: 0", async () => {
  testCalculator("-3 + 3", "0");
});

function testCalculator(input, output) {
  fireEvent.change(document.getElementById("number-input"), {
    target: { value: input }
  });

  document.getElementById("btn-result").click();

  const container = document.getElementById("result");

  waitForDomChange({ container }).then(() => {
    expect(container.innerText).toBe(output);
  });
}
