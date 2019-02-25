# 고계 자바스크립트

## 자바스크립트가 함수형 프로그래밍을 배우기 좋은 언어인 이유

펀재성(omnipresence): 어디에나 있음. 모바일, 웹 프론트 / 백엔드, 임베디드, 데스크톱, DB 등 다양한 곳에서 쓰임
동적 형식(dynamically typed)
ES6에서 추가된 기능들 덕분에 더 함수형으로 사용하기 편해짐: arrow function, iteratior, 상수, promise 등

그러나 자바스크립트는 함수형인 동시에 객체지향 언어이기도 하다. 둘의 차이를 잘 알아야 함.

자바스크립트의 함수는 주요 작업 단위로서 어플리케이션에게 할 일을 시키는 역할 뿐만 아니라 객체의 모듈 생성, 이벤트 처리 등의 책임도 맡는다.

## 함수형 vs 객체지향
가장 중요한 차이는 데이터(객체 속성)와 기능(함수)를 조작하는 방법에 있음.

객체지향 어플리케이션은 인스턴스 메서드를 통해 가변 상태를 조출하고 조작할 수 있도록, 객체 기반의 캡슐화에 의존한 채 가변 상태의 무결성을 유지함. 객체의 데이터와 잘게 나뉜 기능이 단단히 유착되어 응집도가 높은 패키지가 형성됨.

함수형 프로그램은 데이터와 기능을 느슨하게 결합함. 여러 자료형에 두루 적용 가능하고 굵게 나뉜(coarse-grained)연산에 더 의존함.
함수는 함수형 패러다임의 **주된 추상화 형태** 이다.

student를 예로 들어보면

```javascript
class Person {
  constructor(firstname, lastname) {
    this._firstname = firstname;
    this._lastname = lastname;
    this._birthYear = null;
  }
  get firstname() {
    return this._firstname;
  }
  get lastname() {
    return this._lastname;
  }
  set birthYear(year) {
    this._birthYear = year;
  }
  get birthYear() {
    return this._birthYear;
  }
}

class Students extends Person {
  constructor(firstname, lastname, school) {
    super(firstname, lastname);
    this._school = school;
  }
  get school() {
    return this._school;
  }
}
```

위와 같은 클래스가 정의되어 있을 때 다니는 학교가 같은 사람을 찾는다

```javascript
// 객체지향 - class 안에 아래 함수를 넣어준다.
studentsInSameSchool(friends) {
  const result = [];
  for(let i in friends) {
    if (friends[i].school === this.school) {
      result.push(friends[i]);
    }
  }
  return result;
}

const friends = []; // 친구들이 들어있는 배열
someone.studentsInSameSchool(friends); //이런식으로 호출

// 함수형
const selector = (school) =>
  (student) => student.school === school;

const findStudentsBy(friend, selector) => friends.filter(selector);

findStudentsBy([friend1, friend2, friend3], selector('schoolName')); // 이런식으로 호출함
```

*객체지향*은 **데이터와 데이터 관계의 본질**에 초점을 두는 반면, *함수형*은 **해야 할 일**에 초점을 둔다.

함수형

- 합성단위: 함수
- 프로그래밍 스타일: 선언적
- 데이터와 기능: 독립적인 순수함수가 느슨하게 결합
- 상태 관리: 객체를 불변 값으로 취급
- 제어 흐름: 함수와 재귀
- 스레드 안전: 동시성 프로그래밍 가능
- 캡슐화: 모든것이 불변이라 필요 없음.

객체지향형

- 합성단위: 객체(클래스)
- 프로그래밍 스타일: 명령형
- 데이터와 기능: 클래스 안에서 메서드와 단단히 결합
- 상태 관리: 인스턴스 메서드를 통해 객체를 변이시킴
- 제어 흐름: 루프와 조건 분기
- 스레드 안전: 캡슐화하기 어려움
- 캡슐화: 데이터의 무결성을 지키기 위해 필요함

### 자바스크립트 객체의 상태관리
프로그램의 **상태**란 어느 한 시점에 찍은 모든 객체에 저장된 데이터의 스냅샷이다.
자바스크립트는 클래스 형태로 만들더라도 외부에서 내부 속성에 접근 가능하기 때문에 프로그램의 상태 관리를 하기가 어렵다. 이를 해결하기 함수형에서는 위해 **값 객체 패턴, deep object freeze, 렌즈 또는 함수형 레퍼런스**라는 객체 기법을 사용한다. (객체지향에서는 클로저를 이용하여 private변수처럼 사용하는 방법을 이용함)

불변성을 바탕으로 사고하려면 사실상 모든 객체를 값으로 취급해야 한다. -> 객체가 도중에 바뀔지 모른다는 불안감을 갖지 않고 객체를 주고받는 함수를 만들 수 있다.

ES6의 **const** 키워드를 이용해 상수를 선언할 수 있다.
but.. 해당 변수가 가진 레퍼런스만 변경하지 않도록 방지해주고, 참조하는 실제 객체의 내부가 변화되는 것은 막을 수 없다. -> **Object.freeze()** 를 이용하면 객체의 writable 속성을 false로 바꾸어 쓰지 못하게 변경할 수 있지만, 그것도 최상위 객체만 적용되지 그 내부까지는 적용되지 않는다 (shallow) -> deep freeze를 구현하여 사용해야 함(일일히 내부를 동결하는 코드를 작성해야함)

데이터 변이 방지 목적으로 **캡슐화**도 좋은 전략이다.
클로저를 이용하여 private 변수처럼 사용할 수 있는 내부 변수를 만들고, 그에 접근할 수 있는 객체 리터럴 인터페이스(object literal interface)를 반환하는 식으로 내부 상태를 직접 변경하는 것을 막을 수 있음

객체구조가 단순하면 **값 객체 패턴(value object pattern)**도 괜찮은 방안이다. 함수를 호출하면 받은 파라미터를 바탕으로 새로운 객체를 생성하여 반환한다. 처음에 만들었던 것이 변경되는 게 아니라, 새로운 객체가 만들어지는 것!

불변 상태를 한곳에서 관리하는 lense라는 기법도 있다.

*렌즈..? 잘모르겠다... 람다JS가 아니라 lodash로도 이런걸 할 수 있나? 람다JS를 이용하여 책에 있는 부분 구현하는걸 이번주 과제로!*

## 함수

- 작업의 기본단위
- ()연산자를 적용하여 평가(evaluation)할 수 있는 모든 호출 가능 표현식
- 결과로 계산한 값 또는 undefined를 반환한다.

functional programming에서의 함수는 null이나 undefined가 아닌 **사용 가능한 결과**를 낼 때에만 유의미함.

- expression(표현식): 값을 내는 함수. FP에서 유의미한 함수
- statement(구문): 값을 내지 않는 함수. void함수

### JS의 함수는 **일급시민(first-class)**

함수 그 자체가 객체이기 때문에 일급(first-class)이다. 그래서 함수를 여러가지 방법으로 선언할 수 있다.

```javascript
// 일반적인 함수 선언
function square(x) {
  return x * x;
}

// 익명함수 anonymous function
const square = function(x){
  return x * x;
}

// 람다 표현식
const square = x => x * x;

//객체 속성에도 할당 가능
const obj = {
  method: function(x) {
    return x * xl
  }
}

//생성자를 통해 함수를 인스턴스화하는 방법도 있다(많이 안쓰는 방법)
const square = new Function('x', 'return x * x');
```

함수를 호출할 때 () 연산자를 사용하고, 함수 객체 자제를 출력할 수도 있다.

자바스크립트 함수는 **Function 형식의 인스턴스**이다.

someFunction.length는 정규 매개변수를 갯수를 나타내며, apply()와 call() 메서드는 주어진 함수를 콘텍스트로 호출함.

익명 함수의 표현식의 우변은 name속성이 빈 함수 객체이다. 익명 함수는 어떤 함수의 기능을 확장하거나 특화시킬 때 인수로 전달한다.

```javascript
//(ex: filter, sort에 함수를 전달할 때 )
someArray.sort(function(prev, next) {
  return prev.attribute1 - next.attribute1;
});
```

sort() 함수처럼 값을 할당할 수 있으면서 다른 함숟 인수로 받을 수 있으므로 **고계함수** 범주에 속한다.

### **고계함수**

고계함수(high-order function): 함수를 파라미터로 전달하거나, 결과로 함수를 반환하는 함수

지바스크립트의 함수는 일급 + 고계 여서 **여느 값이나 다름없다**.

자신이 받은 입력값을 기반으로 정의된 언젠가는 실행될 값(yet-to-be-excuted)

multiplier, comparator, action같은 명사로 함수를 명명하는것은 자바스크립트 같은 언어에서 볼 수 있는 독특한 패턴이다.

함수형 프로그래밍을 하기 위해서는

1. 동작을 쪼개고
2. 그 동작들을 조합해서 당초 직면한 문제를 해결하는 방식

으로 생각해야 할 듯.

printPeople함수를 작성한다고 하면, 사람 리스트 데이터로부터

1. 원하는 사람을 선택한다(selector)
2. 원하는 프린트 포맷으로 출력한다(printer)

이렇게 두가지 동작으로 구분이 가능하다. 이 동작들을 조합하여 수행하는 함수를 만들어서 printPeople 함수를 정의해주면 됨.

데이터를 고르는 기준(selector)도, 출력 포맷도(printer) 각각 혹은 동시에 마음대로 변경할 수 있다.

### 자바스크립트 함수 호출 유형

자바스크립트 함수는 호출 시점의 런타임 콘텍스트, 즉 함수 본체 내부의 this값을 자유롭게 지정할 수 있으며 호출하는 방법도 다양하다.

- 전역 함수로 호출: this는 전역객체(window) 혹은 undefined
- 메서드로 호출: this는 해당 메서드를 소유한 객체
- new를 붙여 생성자로 호출: this는 새로 만든 객체의 레퍼런스를 암시적으로 반환

이처럼 this 레퍼런스가 가리키는 대상은 어휘적 콘텍스트(코드상 위치)가 아니라 함수를 사용하는 방법(전역, 객체 메서드, 생성자)에 따라 달라진다. 이때문에 함수가 실행되는 콘텍스트를 잘 봐야 한다.

이러한 콘텍스트를 지정하여 함수를 실행해줄 수 가 있는데, 이때 call, apply 함수를 이용한다.(Function type객체의 프로토타입에 존재함)

```javascript
// apply은 인수 배열을, call은 인수를 목록으로 받는다.
Function.prototype.apply(thisContext, [param1, param2, ...]);
Function.prototype.call(thisContext, param1, param2, ...);
```

객체지향에서는 위와 같은 맥락이 굉장히 중요하지만, 함수형 프로그램에서 순수함수를 사용하면 함수가 콘텍스트 상태에 의존하지 않기 때문에 이런 것으로 고통받을 일도, 이를 바탕으로 로직을 짤 수도 없게된다.

## 클로저와 스코프

**클로저**: 함수를 선언할 당시의 환경에 함수를 묶어둔 자료구조. (정적 스코프 static scope 또는 어휘 스코프 lexical scope 라고도 함)

고계함수를 응용한 함수형 프로그래밍 뿐만 아니라 이벤트 처리 및 골백, 프라이빗 변수 모방, 자바스크립트의 일부 약점을 보완하는 용도로 유익함
