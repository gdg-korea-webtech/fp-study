> [오늘의 문제 풀이]
>
> 1. 현섭님 문제 - [링크](https://stackblitz.com/edit/fp-study?embed=1&file=index.js)

# Chapter 2. 고계 자바스크립트

### wrote by. robin

## 2.1 왜 자바스크립트인가?

- 자바스크립트는 아직도 진화하고 있다. ES6에 화살표 함수, 상수, 이터레이터, 프라미스 등 함수형 프로그래밍에 어울리는 가능이 많이 추가되었다.
- 하지만, 자바스크립트는 함수형인 동시에 객체지향 언어이다.

## 2.2 FP vs OOP?

```javascript
// OOP
var person = new Student("Alonzo", "Church", "444-44-4444", "Princeton");
person.fullname;

// FP
const fullname = Person => [Person.firstname, Person.lastname].join(" ");
fullname(person);
```

- OOP : 인스턴스 메서드가 `this`로 객체 데이터에 접근하는 자체가 부수효과이다.
- FP : 객체를 명시적인 매개변수로 전달하므로 `this`를 사용할 필요가 없고 부수효과도 없다.
- OOP는 메서드에 상속 계층을 두고 데이터를 서로 단단히 묶는 일에 열중하지만, 이와 다르게 FP는 다양한 자료형을 아우르는 일반적인 다형성 함수를 선호하며 this는 가급적 사용하지 않는다.

|                   |                        FP                        |                  OOP                   |
| :---------------: | :----------------------------------------------: | :------------------------------------: |
|      관심사       |                 기능(해야 할 일)                 |         데이터와 데이터의 관계         |
|     합성 단위     |                       함수                       |              객체(클래스)              |
| 프로그래밍 스타일 | 선언적 (실행할 일련의 함수를 선언하는 것에 집중) |    명령형 (알고리즘적 로직에 집중)     |
|   데이터와 기능   |        독립적인 순수함수가 느슨하게 결합         |   클래스 안에서 메서드와 단단히 결합   |
|     상태 관리     |             객체를 불변 값으로 취급              | 인스턴스 메서드를 통해 객체를 변이시킴 |
|     제어 흐름     |                   함수와 재귀                    |            루프와 조건 분기            |
|      캡슐화       |            모든것이 불변이라 필요없음            |    데이터 무결성을 지키기 위해 필요    |

### 2.2.1 자바스크립트 객체의 상태 관리

- `상태` : 어느 시점에서 찍은 모든 객체에 저장된 데이터의 스냅샷
- 자바스크립트 객체는 너무나 동적이어서 언제건 속성을 추가, 삭제, 수정할 수 있다. => 자칫 관리 안되는 코드로 발전할 위험성이 있다.
- 불변 기능을 지닌 불변 객체는 순수 객체로 볼 수 있다.

### 2.2.2 객체를 값으로 취급

- 변수에 값이 재할당 되는 것은 막을 수 있지만, 속성 값은 언제라도 바꿀 수 있다.

```javascript
//변수에 값이 재할당 되는 것은 막을 수 있다.
const student = new Student("jang", "91-03-15");
studnet.lastName = "JANG"; //속성 값이 바뀐다.
```

- **해결 방안** 클로저를 사용해서, 메서드를 일부만 호출자에게 공개하고, 프라이빗 변수처럼 다루는 객체 리터럴 인터페이스를 반환하는 형식으로 사용한다.

```javascript
function Student(lastName, birthday) {
  let _lastName = lastName;
  let _birthday = birthday.split("-").join("");

  return {
    lastName: function() {
      return _lastName;
    },
    birthday: function() {
      return _birthday;
    },
    print: function() {
      return `${_lastName} ${_birthday}`;
    }
  };
}

const student = Student("jang", "91-03-15");
console.log(student.print()); //jang 910315
```

### 2.2.3 가동부를 깊이 동결

- `Object.freeze()` : 해당 Object의 속성은 모두 읽기 전용 상태로 바뀌어, 바꾸려고 시도하면 에러가 발생한다.
- 최상위 객체만 동결(shallow freeze)되므로, 내부 객체의 속성까지 확실하게 동결하고 싶을 때는 한 객체의 중첩 구조를 일일이 수작업으로 동결해야 한다.

### 2.2.4 객체 그래프를 렌즈로 탐색/수정 ???

- `렌즈 lense` 또는 `함수형 레퍼런스` : 객체의 불변 상태를 한 곳에서 관리한다.

```javascript
// 람다JS는 전역 객체 R로 모든 기능을 노출한다.
var person = new Person("Alonzo", "Church", "444-44-4444");
var lastnameLens = R.lenseProp("lastname");

// 원래 객체 상태는 그대로 유지하고, 새로운 값이 포함된 객체 사봄을 새로 만들어 반환한다.
const newPreson = new R.set(lastnameLens, "Mouring", person);
R.view(lastnameLens, person); // 속성의 내용 꺼내보기 - 'Church'

// 렌즈는 Person의 address 같은 중첩 속성도 지원한다.
person.address = new Address(
  'US', 'NJ', 'Princeton', zipCode('08544', '1234'),
  'Alexander St.');
)

// address.zip 속성을 렌즈로 탐색한다.
const zipPath = ["address", "zip"];
const zipLens = R.lens(R.path(zipPath), R.assocPath(zipPath));
R.view(zipLens, person);
```

- 함수형으로 작동하는 getter/setter : 필드에 접근하는 로직을 객체로부터 분리하여 this에 의존할 일을 없애고, 어떤 객체라도 그 내용물에 접근하여 조작할 수 있도록 한다.

## 2.3 함수

- FP에서 함수는 작업의 기본 단위이다.
- 함수는 () 연산자를 적용하여 평가할 수 있는 모든 호출 가능 표현식이다. 호출자에게 계산한 값 또는 undefined를 반환한다.
- 이 책에서는 `표현식(expression) - 값을 내는 함수`와 `구문(statement) - 값을 내지 않는 함수`로 구분한다.

### 2.3.1 함수를 일급 시민으로

- 자바스크립트에서 함수가 객체이기 때문에 일급 시민이라고 한다.

- 함수를 선언하는 방법

  - 익명 함수 또는 람다 표현식으로 변수에 할당

  ```javascript
  //익명 함수
  const square = function(x) {
    return x * x;
  };

  //람다 표현식
  const square = x => x * x;
  ```

  - 객체 속성에 메서드 형태로 할당

  ```javascript
  const obj = {
    method: function(x) {
      return x * x;
    }
  };
  ```

  - (잘 안씀) 생성자를 통해 함수를 인스턴스화

  ```javascript
  const multiplier = new Function("a", "b", "return a * b");
  multiplier(2, 3); //6
  ```

### 2.3.2 고계함수

- `고계함수(higher-order-function)` : 함수를 인수로 전달하거나 함수를 반환 받을 수 있다.

### 2.3.3 함수 호출 유형

- 호출 시점의 런타임 콘텍스트, 즉 함수 본체 내부의 this값을 자유롭게 지정할 수 있으며, 호출하는 방법도 다양하다.

1. 전역 함수로 호출 : this 레퍼런스는 전역 객체, 또는 undefined(strict mode에서)를 가리킨다.
2. 메서드로 호출 : this 레퍼런스는 해당 메서드를 소유한 객체이다.
3. 앞에 new를 붙여 생성자로 호출 : 새로 만든 객체의 레퍼런스를 암시적으로 반환한다.

- 함수가 실행되는 콘텍스트를 잘 살펴야하는 이유 : **다른 프로그래밍 언어와는 달리 this 레퍼런스가 가리키는 대상은 코드상의 위치가 아니라, 함수를 사용하는 방법에 따라 달라진다.**

### 2.3.4 함수 메서드

apply와 call을 이용해서 호출하면 this binding을 바꿀 수 있다.

- apply : 인수 배열
- call : 인수를 목록으로 받음

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
