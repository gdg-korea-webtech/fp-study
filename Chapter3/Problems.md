# 1. 현섭님 문제

다음 처럼 동작하는 `toUpperString` 함수를 재귀 함수를 써서 작성하세요.

```javascript
// 입력은 항상 Valid한 HTML 문자열
function toUpperString(html) {
  // ...
}

const case1 = "<h1>Hello</h1>";
toUpperString(case1); // return '<h1>HELLO</h1>'

const case2 = "<p>Functional<span>Programming</span>Study</p>";
toUpperString(case2); // return '<p>FUNCTIONAL<span>PROGRAMMING</span>STUDY</p>'

const case3 = "I'm HyunSeob";
toUpperString(case3); // return 'I\'M HYUNSEOB'

const case4 = "";
toUpperString(case4); // return ''
```

힌트1: 가상의 DOM을 만들어 `inerHTML`을 사용해서 HTML 문자열을 파싱하면 편리합니다.
힌트2: DOM API를 적극적으로 활용하셔도 됩니다.
힌트3: 추가적인 함수를 더 정의하셔도 됩니다.

# 2. 보람님 문제

주어진 컬렉션에서, Force 사용자의 총점을 구하라.

[오늘의 문제](https://stackblitz.com/edit/fp-study-today)
