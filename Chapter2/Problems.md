# 1. 현섭님 문제

아래처럼 동작하는 함수 makeHttpClient를 구현하세요.

```js
const httpClient = makeHttpClient({ baseURL: "https://github.com/api" });

httpClient.get("/users"); // 콘솔에 `GET: https://github.com/api/users` 출력
httpClient.post("/groups"); // 콘솔에 `POST: https://github.com/api/groups` 출력
```

# 2. 송희님 문제

클로저 연습
본문 텍스트의 크기를 각각 12,14,16 픽셀로 조정하는 함수 작성

[동작 예시](https://closure-practice1.stackblitz.io)

[Fork해서 작성해보세요](https://stackblitz.com/edit/closure-practice1-quest?file=index.js)

`html`

```html
<button id="size-12">12</button>
<button id="size-14">14</button>
<button id="size-16">16</button>

<p>Some paragraph text</p>
<h1>some heading 1 text</h1>
<h2>some heading 2 text</h2>
```

`js`

```js
function makeSizer(size) {
  //Write the code here
}

var size12 = makeSizer(12);
var size14 = makeSizer(14);
var size16 = makeSizer(16);

document.getElementById("size-12").onclick = size12;
document.getElementById("size-14").onclick = size14;
document.getElementById("size-16").onclick = size16;
```
