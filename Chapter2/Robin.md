> [오늘의 문제 풀이]
>
> 1. 현섭님 문제 - [링크](https://stackblitz.com/edit/fp-study?embed=1&file=index.js)

# Chapter 2. 고계 자바스크립트

### wrote by. robin

## 2.1 왜 자바스크립트인가?

## 2.2 FP vs OOP?

### 2.2.1 자바스크립트 객체의 상태 관리

### 2.2.2 객체를 값으로 취급

### 2.2.3 가동부를 깊이 동결

### 2.2.4 객체 그래프를 렌즈로 탐색/수정

## 2.3 함수

### 2.3.1 함수를 일급 시민으로

### 2.3.2 고계함수

### 2.3.3 함수 호출 유형

### 2.3.4 함수 메서드

## 2.4 클로저와 스코프

```javascript
function outer() {
  var a = 1;
  console.log(a);
}
outer(); //1
```

- 스코프 : 변수를 어디에서 어떻게 찾을 지 정한 규칙.
- 자바스크립트는 함수 단위로 스코프가 생성된다.

```javascript
function outer() {
  var a = 1;
  function inner() {
    var a = 2;
    console.log(a);
  }
  inner();
}
outer(); //2
```

- 스코프 체인 : 가장 안 쪽에서 부터 바깥쪽(글로벌)로 올라가며 찾는다.
  못 찾으면 undefined
- 스코프 체인 작동 순서

1. 변수의 함수 스코프를 체크 한다.
2. 지역 스코프(함수 스코프/블록 스코프)에 없으면 자신을 감싼 바깥쪽 어휘 스코프로 이동해서 전역 스코프에 도달할 때까지 변수 레퍼런스를 계속 찾는다.
3. 지역 스코프(함수 스코프/블록 스코프)에 없으면 자신을 감싼 바깥쪽 어휘 스코프로 이동해서 전역 스코프에 도달할 때까지 변수 레퍼런스를 계속 찾는다.
4. 그래도 변수가 참조하는 대상이 없으면 undefined를 반환한다.

```javascript
function outer() {
  var a = 1;
  var b = "B";
  function inner() {
    var a = 2;
    console.log(b);
  }
  inner();
}
var someFun = outer();
someFun(); //2
```

- 클로져 : 함수를 선언할 당시의 환경에 함수를 묶어둔 자료 구조이다. 생성한 시점의 스코프체인을 가지고 있는다.
  outer가 실행된 이후에도 outer의 스코프에 접근할 수 있다.

- **[Quiz] 다음 중 클로저에 해당 하는 예시는 몇 번 일까요?**
  (ref.책 함수형 프로그래밍 - 유인동)

1.

```javascript
var a = 10;
var b = 20;
function f1() {
  return a + b;
}
f1(); //30
```

2.

```javascript
function f2() {
  var a = 10;
  var b = 20;
  function f3(c, d) {
    return c + d;
  }
  return f3;
}
var f4 = f2();
f4(5, 7); //12
```

3.

```javascript
function f4() {
  var a = 10;
  var b = 20;
  function f5() {
    return a + b;
  }
  return f5();
}
f4(); //30
```

4.

```javascript
function f6() {
  var a = 10;
  function f7(b) {
    return a + b;
  }
  return f7;
}
var f8 = f6();
f8(20); //30
```

### 2.4.4 클로저 응용

1. 프라이빗 변수를 모방

```javascript
function zipCode(code) {
  let _code = code;

  return {
    code: function() {
      return _code;
    }
  };
}

const getZipCode = zipCode("08544");
getZipCode.code(); //'08544'
```

- **Point**
  - 외부에서 접근할 수 없는 변수/함수,
  - 모듈 패턴 => 모듈 내부 메서드에서만 접근 가능.

2. 서버 측 비동기 호출(?)

- **Point**
  - 콜백 함수 ... => 콜백 지옥

3. 가상의 블록 스코프 변수를 생성

- **Point**

  - 블록 변수가 생기기 전까지 클로저와 함수스코프를 적극 활용한 forEach로 해결.
  - 블록 스코프 예시

  ```javascript
  function setClick() {
    for (let i = 0; i < 3; i++) {
      btns[i].onClick = function() {
        console.log(i);
      };
    }
  }
  ```

  ```javascript
  "use strict";

  function setClick() {
    var _loop = function _loop(i) {
      btns[i].onClick = function() {
        console.log(i);
      };
    };

    for (var i = 0; i < 3; i++) {
      _loop(i);
    }
  }
  ```

````

## 2.5 마치며

> reference
>
> - [자바스크립트 대표적 클로저 실수를 let으로 해결?](https://www.youtube.com/watch?v=RZ3gXcI1MZY)

> [오늘의 문제]

```html
<button id="btn0">btn0</button>
<button id="btn1">btn1</button>
<button id="btn2">btn2</button>
````

```javascript
var btns = [
  document.getElementById("btn0"),
  document.getElementById("btn1"),
  document.getElementById("btn2")
];

function setClick() {
  for (var i = 0; i < 3; i++) {
    btns[i].onClick = function() {
      console.log(i);
    };
  }
}

setClick();
```

> - 해답 : [클로저와 스코프](https://medium.com/@khwsc1/%EB%B2%88%EC%97%AD-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%8A%A4%EC%BD%94%ED%94%84%EC%99%80-%ED%81%B4%EB%A1%9C%EC%A0%80-javascript-scope-and-closures-8d402c976d19)
