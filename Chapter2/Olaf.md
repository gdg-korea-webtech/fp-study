# Chap 02. 함수형 프로그래밍 스터디

> 자연어는 지배적인 패러다임이 없습니디. 자바스크립트도 마찬가지입니다. 개발자들은 절차적, 함수형, 객체지향형 접근 방법이 들어 있는 손가방에서 적절히 골라 섞어 쓰면 됩니다.

chap02 에서는 자바스크립트가 왜 함수형 언어로써 손색이 없는지에 대해 살펴봅니다.

## 왜 Javascript 인가?

- 모바일 애플리케이션, 웹사이트, 웹서버, 데스크톱, 임베디드 등 다양한 분야에서 사용되고 있는 FP 언어이다.
- 객체 정의, 모듈 생성, 이벤트 처리등 함수단위로 작업이 이루어진다.

## 함수형 vs 객체지향

성, 이름, 주소 같은 기본 속성을 가진 `Person` 라는 객체가 있을 때 `Student` 는 클래스나 형식 계층 관점에서 성, 이름, 주소 같은 기본 속성을 포함한 `Person`의 하위형이라고 볼 수 있습니다.

> 프로토타입 관계에서 객체 간의 관계를 하위형 또는 파생형 이라고 표현합니다.

`Student` 에 추가할 기능이 생긴하다면 보다 구체화한 `CollegeStudent` 같은 형식을 만들 수 있습니다.  
객체지향 프로그램의 핵심은 새로운 파생 객체를 생성하며 코드를 재사용하는 것 입니다.

이렇게 만들어진 `CollegeStudent` 에서는 부모의 모든 속성을 사용할 수 있지만, 문제는 모든 하위형에 적용할 필요가 없는 기능을 기존 객체에 추가할 때 발생합니다.  
성, 이름은 `Person`과 하위형에 모두 의미가 있지만, `workAdress` 같은 속성은 `Student` 보다는 `Person` 의 파생형인 `Employee` 객체 전용 속성입니다.

객체지향과 함수형의 가장 중요한 차이점은 이러한 데이터와 기능을 조작하는 방법에 있습니다.

- 객체지향 프로그래밍은 인스턴스 메서드를 통해 가변 상태를 노출하고 조작할 수 있도록, 객체 기반 캡슐화에 의존한채 가변상태의 무결성을 유지합니다.

```js
get fullName () {
  return [this._firstname, this._lastname].join(' ')
}
```

this 를 사용하면 메서드 스코프 밖에 위치하고 있는 인스턴스 수준의 데이터에 접근할 수 있어 `부수효과`를 야기할 수 있습니다.

- 함수형 프로그래밍은 호출자로부터 데이터를 숨기지 않고, 단순한 자료형만을 대상으로 움직입니다. 인스턴스 메서드 대신 여러 자료형에 적용 가능하도록 나뉜 연산에 의존합니다.

```js
const fullName = person => [person.firstname, person.lastname].join(" ");
```

코드가 특정 객체에 종속되지 않아 재사용성, 유지보수성에 좋습니다.

## 코드로 살펴보는 차이점

```js
class Person {
  construtor(firstname, lastname, ssn) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.ssn = ssn;
  }
  // get, set
}
```

```js
class Student extends Person {
  construtor(firstname, lastname, ssn, school) {
    super(firstname, lastname, ssn);
    this.school = school;
  }
}
```

거주 국가가 같은 사람을 전부 찾고, 학생과 거주 국가와 다니는 학교가 모두 같은 학생을 찾는 코드를 짜려고할 떄 객체지향 방식과 함수형 방식을 비교해보겠습니다.

#### 객체지향

```js
peopleInSameCountry (friends) {
  const result = []

  for(let i in friends) {
    const friend = friends[i]
    if(this.address.country === friend.address.country) {
      result.push(friend)
    }
  }
  return result;
}
```

#### 함수형

객체지향과 다른게 상태와 기능을 분리하여 이들을 조합하여 새로운 함수로 연산을 추가할 수 있습니다.

객체지향은 아래와 같이 Person 의 메서드로 찾습니다.

```js
olaf.peopleInSameCountry([a, b, c]);
```

함수형 프로그래밍은 문제들을 작은 함수들로 나눕니다.

```js
// 학생의 거주 국가와 학교를 비교
const selector = (country, school) => student => {
  return student.address.country === country && student.school === school;
};

//
const findStudentsBy = (friends, selector) => friends.filter(selector);

findStudentsBy([a, b, c, d], selector("US", "Princeton"));
```

두 방식을 비교해보면 객체지향은 데이터와 데이터 관계에 초점을 두고, 함수형의 관심사는 기능입니다.

## 객체의 상태 관리

프로그램의 상태란 한 시점에 찍은 객체에 저장된 데이터의 스냅샷 입니다. 자바스크립트는 매우 동적이기 떄문에 언제든 속성을 추가, 삭제, 수정 하는것이 가능하기 때문에 상태보호 하는 측면에서는 좋지 않습니다.

#### 객체를 값으로 취급

함수형 프로그래밍에서는 움직이는 형식을 값이라고 표현합니다. 모든 객체를 값으로 취급해야만 객체가 도중에 바뀐다는 불안감을 갖지 않고 객체를 주고 받는 함수를 만들 수 있습니다.  
그러기 위해 데이터를 불변 레퍼런스로 바라보게 해서 문자열, 숫자를 제외한 사용자 정의 객체도 불변인 것 처럼 동작하게 해야합니다.

상수 레퍼런스는 `ES6` 에 추가된 `const` 키워드로 선언할 수 있습니다. const 로 선언된 값은 재할당 하거나 레퍼런스를 다시 선언할 수 없습니다.

```js
const gravity_ms = 9.806;
gravity_ms = 20; // 재 할당을 허용하지 않습니다.
```

하지만 const 만으로는 FP 가 요구하는 불변성을 실현하기 어렵습니다. 객체 내부상태까지 변하는 것을 봉쇄할 수 없기 때문입니다.

```js
const student = new Student("olaf");
student.name = "olaf-2";
```

그렇기 때문에 조금 더 엄격한 불변성 정책이 필요합니다. 캡슐화도 좋은 전략이고 객체 구조가 단순하다면 값 객체 패턴도 사용하기 좋습니다.

```js
function person(firstname, lastname) {
  const _firstname = firstname;
  const _lastname = lastname;

  return {
    firstname: function() {
      return _firstname;
    },
    lastname: function() {
      return _lastname;
    }
  };
}

const p = person("o", "laf");
p.firstname;
```

#### Object.freeze

`Object.freeze` 함수는 writable 속성을 false 로 세팅하여 객체의 상태를 변경하지 못하도록 합니다. 단 중첩된 객체 속성까지 동결하지 않습니다.
이렇게 최상위 값만 동결되는 것을 얕은 동결 (shallow freeze) 라고 합니다.

```js
const person = new Person("o", "laf");
person.address = new Address(zipCode('blahblah', '"1234", "1234"));

Object.freeze(person);
person.firstname = "a"; // 읽기 전용 속성에 값을 할당할 수 없습니다.
person.address._country = "Korea";
person.address.country; // Korea
```

```js
const isObject = value => value && typeof value === "object";

function deepFreeze(obj) {
  if (isObject(obj) && !Object.isFrozen(obj)) {
    Object.keys(obj).forEach(name => deepFreeze(obj[name]));
    Object.freeze(obj); // root freeze
  }
}
```

## 함수

함수는 작업의 기본 단위입니다.

값을 내는 함수를 `표현식` 값을 내지 않는 함수를 `구문` 이라고 표현합니다.

#### 일급 객체

함수도 객체입니다. 다음과 같은 특징을 가지고 있기 때문에 일급 객체라고도 표현합니다.

- 익명함수 또는 람다 표현식으로 변수에 할당할 수 있습니다.

```js
const square = function(x) {
  return x * x;
};
const square = x => x * x;
```

- 객체 속성에 메서드 형태로 할당할 수 있습니다.

```js
const obj = {
  method: function(x) {
    return x * x;
  }
};
```

- 함수의 인자로 전달 할 수 있습니다.

```js
function addEventListener(eventname, callback) {}
addEventListener("click", function() {});
```

- return 값이 될 수 있습니다.

```js
function add(a) {
  return function(b) {
    return a + b;
  };
}
```

#### 고계 함수

함수를 인수로 전달하거나 함수를 반환할 수 있습니다. 이런 함수를 고계 함수 (higher-order-function) 이라고 합니다.

```js
function applyOperation(a, b, opt) {
  return opt(a, b);
}

const multiplier = (a, b) => a * b;

applyOperation(2, 3, multiplier);
```

#### 함수 호출 유형

함수는 호출 시점의 런타임 컨텍스트에 따라 this 를 자유롭게 지정할 수 있고, 호출하는 방법도 다양합니다.

- 전역 함수로 호출
  this 레퍼런스는 전역 객체, 엄격 모드에서는 undefined 를 가리킵니다.

- 메서드로 호출
  this 레퍼런스는 해당 메서드를 소유한 객체입니다.

- new 생성자 호출
  새로 만든 객체의 레퍼런스를 암시적으로 반환합니다.

- apply, call 를 이용한 this binding

## 클로저

클로저는 함수를 선언할 당시의 환경을 기억하고 있는 함수입니다. 함수 선언부의 물리적 위치에 의존하기 때문에 static scope, lexical scope 라고도 합니다.
이벤트 처리 및 콜백, private 변수 등 자바스크립트의 약점을 보완하는 용도로 유익합니다.

```js
function zipCode(code, location) {
  const _code = code;
  const _location = location;

  return {
    code: function() {
      return _code;
    },
    location: function() {
      return _location;
    }
  };
}

const zip = zipCode("1234", "1234");
zip.code(); // 1234
```

위의 코드에서는 실제 데이터는 감추고 내부 변수에 접근하여 read 만 할 수 있는 함수만 내보내줍니다.

#### 전역 스코프의 문제점

전역 스코프는 어디서든 자유롭게 접근이 가능하비다. 함수형 프로그래밍에서는 관찰 가능한 변화가 함수에서 전파되는 것을 금기하는데 전역 스코프는 그런 변화를 일으키는 원인이 될 수 있습니다.  
전역 데이터는 변수 상태가 언제 어떻게 바뀌는지 추적하기 어렵습니다.

#### 함수 스코프

함수 내부에 선언된 변수는 모두 해당 함수의 지역 변수 입니다. 그렇기 때문에 다른곳에서의 참조는 불가합니다. 함수가 반환되는 시점에 모두 사라집니다.

자바스크립트의 스코프는 다음과 같은 로직으로 작동합니다.

- 변수의 함수 스코프를 체크
- 지역 스코프에 없다면 자신을 감싼 바깥쪽 스코프로 이동합니다.
- 값을 못찾았다면 전역 스코프에 도달할 때까지 레퍼런스틑 찾습니다.
- 결과적으로 값이 없다면 undefined 를 반환합니다.

```js
const outterVal = "outter";

function makeInner(params) {
  const innerVal = "inner";

  function inner() {
    console.log(`params: ${params}`);
    console.log(`inner: ${innerVal}`);
    console.log(`outter: ${outter}`);
  }
  return inner;
}

const inner = makeInner("Params");
inner();
```

#### 블록 스코프

표준 ES5 자바스크립트는 블록 수준의 스코프를 지원하지 않습니다.

```js
function doWork() {
  if (!myVar) {
    var myVar = 10;
  }
  console.log(myVar); // 10
}
doWork();
```

내부족으로 변수와 함수 선언부를 현재 스코프의 최 상단으로 끌어올리기 때문에 위와 같은 일이 가능합니다.
ES6 부터는 const, let 키워드로 이런 모호함을 극복할 수 있습니다.

```js
function doWork() {
  if (!myVar) {
    let myVar = 10;
  }
  console.log(myVar); // myVar is not defined
}
doWork();
```

#### 클로저 응용

- 프라이빗 변수를 모방

모듈 패턴을 이용하여 데이터를 private 하게 다룰 수 있습니다.

```js
const MyModule = (function(export){
  const _privateVar = ''

  export.method = function(){
    // _privateVar
  }
})(MyModule || {})
```

- 서버 측 비동기 호출

```js
getJSON(
  "/students",
  students => {
    getJSON(
      "/students/grades",
      grades => grades => proessGrades(grades),
      error => console.log(error)
    );
  },
  error => console.log(error)
);
```
