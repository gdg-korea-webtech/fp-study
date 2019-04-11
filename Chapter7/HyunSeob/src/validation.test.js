import mockConsole from "jest-mock-console";
import {
  getByPlaceholderText,
  getByText,
  waitForDomChange
} from "dom-testing-library";

let consoleRef = null;

const name = 0;
const phone = 1;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="app">
      <form id="form">
        <input type="text" placeholder="이름" name="name">
        <span id="nameError"></span>
        <br/>
        <input type="text" placeholder="전화번호" name="phone">
        <br/>
        <button id="button" type="submit">제출</button>
      </form>
    </div>
  `;

  require("./validation");

  consoleRef = mockConsole();
});

afterEach(() => {
  document.body.innerHTML = "";
  console.error.mocks.calls = [];
});

afterAll(() => {
  consoleRef();
});

test("no input", () => {
  getByPlaceholderText(document.body, "이름").value = "";
  document.getElementById("button").click();

  expect(console.error.mock.calls[name][0]).toBe("이름을 입력해주세요.");
  expect(console.error.mock.calls[phone][0]).toBe("전화번호를 입력해주세요.");
});

test("name: 1 letter", () => {
  getByPlaceholderText(document.body, "이름").value = "";
  document.getElementById("button").click();

  expect(console.error.mock).toBe("이름을 입력해주세요?");
});
