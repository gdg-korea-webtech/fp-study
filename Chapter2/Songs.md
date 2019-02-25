[[# Part1 함수형으로 사고하기
## Chapter1 함수형 길들이기

date : 19.02.18


> 객체지향(OO)은 가동부를 캡슐화하여 코드의 이해를 도움
> 
> 함수형 프로그래밍은(FP)은 `가동부를 최소화`하여 코드의 이해를 도움

 
---
### 1.1 함수형 프로그래밍은 과연 유용한가?

**FP 사고방식**
- 확장성 : 추가 기능 확장이 용이하도록
- 모듈화 용이성 : 다른 파일에 영향을 받지 않도록
- 재사용성 : 중복을 줄이자
- 테스트성 : 단위 테스트가 쉽도록
- 헤아리기 쉬움 : 체계가 있고 따라하기 쉽도록
  

**기본개념**
- 선언적 프로그래밍
- 순수함수 : 상태변이를 일으키지 않도록
- 참조 투명성
- 불변성


자바스크립트만의 매우 표현적인 특성을 가다듬어, 깔끔하면서도 모듈적인, 테스트하기 좋고 간결한 코드를 작성하는 데 도움이 되고 업무 능률 향상

순수함수에 기반을 두고 이미 검증된 기법에 따라 구현하면 코드가 복잡해지더라도 헤아리기 쉬운 방향으로 작성할 수 있음

전체 애플리케이션 품질을 향상시키는 동시에 자바스크립트 언어를 더 잘 이해할 수 있음

---

### 1.2 함수형 프로그래밍이란?
`함수 사용을 강조`하는 소프트웨어 개발 스타일로 하나의 코드 작성 방법

애플리케이션의 부수효과(side effect)를 방지하고 상태 변이(mutation of state)를 감소하기 위해 데이터의 제어 흐름과 연산을 추상(abstract)하는 것

>Before
```js
function printMessage(elementId, format, message){
    document.querySelector(`#${elementId}`).innerHTML = 
    `<${format}>${message}</${format}>`
}
```
>After
```js
var printMessage = run(addToMsg('msg'), h1, echo);
printMessage('hello songs');
```

**함수형 프로그래밍의 기본원리**

재사용성, 믿음성이 좋고 이해하기 쉬운 작은 조각들로 프로그램을 나눈 후,
전체적으로 더 헤아리기 쉬운 형태의 프로그램으로 조합하는 과정

코드를 쉽게 변경하기 위해 코드 자체를 매개변수화

---

#### 1.2.1 함수형 프로그래밍은 선언적

`선언적(declarative)`프로그래밍 패러다임

내부적으로 코드를 어떻게 구현했는지, 데이터는 어떻게 흘러가는지 밝히지 않은 채 연산/작업을 표현, 함수로 추상하는 작업

제어 흐름이나 상태 변화를 특정하지 않고도 프로그램 로직이 무엇인지 표현식으로 나타냄

함수를 매개변수로 받는 `map, reduce, filter`같은 고계함수를 이용해 재사용성, 확장성이 우수한 선언적 코드로 대체하자

---

#### 1.2.2 순수함수와 부수효과

>순수함수

`불변 프로그램 구축`을 전제로 함

- 주어진 입력에만 의존하여 변경될 수 있는 숨겨진 값이나 외부상태와 무관하게 작동
- 함수 수코프 밖에서 어떠한 변경도 일으키지 않음

익숙한 명령형 프로그래밍에서는 변수가 옮겨지면서 그 값이 변하게 됨

자신의 스코프에 없는 외부변수를 읽고 수정하게 되면서 부수효과를 일으키고 호출 도중에 언제라도 변할 수 있어서 어떤 값이 반환될지 알 수 없게 되는 문제 발생

온갖 변경이 난무하는 프로그램에서 순수함수를 사용하기란 어려울수 있지만, `상태 변이를 줄이고 관리할 수 있는` 프레임워크를 제공하여 순수/불순 함수를 구분 하자


>`커링(currying)`기법

함수의 여러 인수를 부분적으로 나누어 세팅하여 쉽게 조합해서 실행 가능한 함수로 만듦

---

#### 1.2.3 참조 투명성과 치환성

참조 투명성은 순수함수를 정의하는 공식적인 방법

`순수성` : 함수의 인수와 결괏값 사이의 순수한 매핑 관계

어떤 함수가 동일한 입력을 받았을 때 동일한 결과를 내면 `참조 투명한`함수

> Before
```js
var counter = 0;

function increment(){
    return ++counter;
}
```

외부 변수를 제거하고 함수 서명에 정규 매개변수로 명시

> After ES6 람다 표현식
```js
var increment = counter => counter + 1;
```

코드 테스트와 전체 로직 파악 용이

---

#### 1.2.4 불변 데이터 유지하기

기본형은 처음부터 불변이지만 배열 등의 객체는 불변이 아니어서 함수 인수로 전달해도 원래 내용이 변경되어 부수효과가 발생할 소지가 남아 있음, 이를 극복하는 방안은 다음 장 이후에...

`함수형 프로그래밍`은 외부에서 관찰 가능한 `부수효과가 제거`된 `불변 프로그램`을 작성하기 위해 `순수함수`를 `선언적`으로 평가하는 것

---

**문제점**

- 뚜렷한 체계 없이 분기 처리 남발
- 외부 공유 변수에 지나치게 의존하는 덩치 큰 함수 과용
- 많은 파일이 한데 뒤섞여 추적/디버깅이 어려움
- 가변/전역 데이터를 공유하는 촘촘한 그물망이 형성 됨
  
---

### 1.3 함수형 프로그래밍의 좋은 점

어떤점이 좋은지 3가지 측면에서 살펴보자

- 간단한 함수들로 작업을 분해
- 흐름 체인으로 데이터를 처리
- 리액티브 패러다임을 실현하여 이벤트 중심 코드의 복잡성을 줄임
---

#### 1.3.1 복잡한 작업을 분해하도록 유도

FP에서 모듈화는 단일성의 원리와 밀접한 관련

모름지기 함수는 저마다 한 가지 목표만 바라봐야 한다

`합성`기법 : 두 함수를 합성하여 다음 함수에 밀어 넣는 새로운 함수가 탄생

고수준의 추상화를 통해 자세한 내막을 밝히지 않아도 코드가 수행하는 전단계를 일목요연하게 나타냄

---

#### 1.3.2 데이터를 매끄럽게 체이닝하여 처리

함수체인은 필요한 시점까지 실행을 미루는 느긋한 평가를 수행

다른 데에선 쓸일이 없는 일련의 코드를 전부 실행하지 않아도 되니 CPU부하가 감소하여 성능 향상

필요 시 호출 

---

#### 1.3.3 복잡한 비동기 애플리케이션에서도 신속하게 반응


**`리액티브 프로그래밍`**

- 비동기 데이터 흐름에 기반을 둔 프로그래밍 패러다임함수형 프로그래밍의 응용분야
- 비동기 코드, 이벤트 중심 코드의 복잡도를 현저하게 줄이는데 도움
- 더 높은 수준으로 코드를 추상하고 함수를 체인으로 묶고 합성
- 순수함수를 이용하여 `map, reduce` 처럼 많이 쓰는 연산으로 데이터를 처리할 수 있고 람다 표현식의 간결함을 누릴 수 있다는 이점
- 옵저버블(관찰 가능) 이라는 중요한 장치를 매개로 움직임


---

### 문제

[Currying - 할인쿠폰 함수 만들기](https://www.codingame.com/playgrounds/2980/practical-introduction-to-functional-programming-with-js/currying)](---
layout: post
title: Functional Programming
tags: 
- FP
- javascript
- 함수형 자바스크립트
published: false
---

FP STUDY

# Part1 함수형으로 사고하기
## Chapter2 고계 자바스크립트

date : 19.02.25


> 개발자들은 절차적, 함수형, 객체지향형 접근 방법이 들어 있는 손가방에서 적절히 골라 섞어 쓰면 됩니다.

 
---
### 2.1 왜 자바스크립트인가?

자바스크립트 함수는 주요 작업 단위로서 할일을 시키고, 객체 정의, 모듈 생성, 이벤트 처리를 함

함수형 프로그래밍에 걸맞은 화살표 함수, 상수, 이터레이터, 프라미스 등 기능 추가되며 꾸준히 개선중

---

### 2.2 함수형 대 객체지향 프로그래밍

객체지향과 함수형의 가장 중요한 차이점은 데이터(객체 속성)와 기능(함수)를 조직하는 방법

**객체지향 프로그램**
- 명령형 코드로 이루어짐
- 인스턴스 메서드를 통해 가변 상태를 노출하고 조작 가능
- 객체 기반의 캡슐화에 지나치게 의존한 채 가변 상태의 무결성을 유지
- 모든 추상화의 주요 형태가 객체
- 잘게 나뉜 기능을 구현하기 위해 특수한 자료형을 생성
- 특정 기능이 구현된 여러 자료형을 논리적으로 연결해서 사용
- 메서드에 상속 계층을 두고 데이터를 서로 단단히 묶는 일에 열중

**함수형 프로그램**
- 호출자로부터 데이터를 숨길 필요 없이 아주 단순한 자료형만을 대상
- 데이터와 기능을 느슨하게 결합
- 여러 자료형에 두루 적용 가능하고 굵게 나뉜 연산에 더 의존
- 함수는 추상화 형태
- 합성을 통해 자료형에 수행할 연산을 묶음
- 다양한 자료형을 아우르는 다형성 함수를 선호
- this는 가급적 사용하지 않음
- 객체 데이터가 특정 코드에 종속되지 않아 재사용성, 유지보수성이 좋음


**객체지향, 함수형 프로그래밍의 주요 특징**

 비교| 함수형 | 객체지향형
---- | ---- | ----
합성 단위 | 함수 | 객체(클래스)
프로그래밍 스타일 | 선언적 | 명령형
데이터와 기능 | 독립적인 순수함수가 느슨하게 결합 | 클래스 안에서 메서드와 단단히 결합
상태관리 | 객체를 불변 값으로 취급 | 인스턴스 메스드를 통해 객체를 변이
제어 흐름 | 함수와 재귀 | 루프와 조건 분기
스레드 안전 | 동시성 프로그래밍 가능 | 캡슐화 어려움
캡슐화 | 모든것이 불변이라 불필요 | 데이터 무결성을 지키기 위해 필요

#### 2.2.1 자바스크립트 객체의 상태 관리

자바스크립트 객체는 너무나 동적이어서 상태 관리는 중요

#### 2.2.2 객체를 값으로 취급

불변 값인데 왜 움직이는 형식이라고 표현한걸까?

#### 2.2.3 가동부를 깊이 동결

객체 상태를 못바꾸게 동결

```js
const person = Object.freeze(new Person('songs', 'hello', '777-77-7777'));
person.firstname = 'Bob'; //에러발생 
//읽기 전용 속성에 값을 할당할 수 없습니다.
```

얕은 동결(shallow freeze) : 최상위 객체만 동결

#### 2.2.4 객체 그래프를 렌즈로 탐색/수정

OOP에서는 메서드를 호출해서 상태적 객체의 내부 내용을 바꾸는 일이 비일비재

같은 코드를 도배하지 않고도 상태적 객체를 불변 상태로 바꿀수 있는 묘안이 필요

`렌즈` 또는 `함수형 레퍼런스`

상태적 자료형의 속성에 접근하여 불변화하는 기법

```js
var person = new Person('songs', 'hello', '777-7777');
var lastnameLens = R.lenseProp('lastname');

//R.set을 호출하면 원래 객체 상태는 그대로 유지한 채 새로운 값이 포함된 객체 사본을 새로 만들어 반환
var newPerson = R.set(lastnameLens, 'Morning', person);
newPerson.lastname; // 'Morning'
person.lastname; // 'songs'
```

물밑에서 조용히 객체를 다룬다..

---

### 2.3 함수

함수: 연산자를 적용하여 평가할 수 있는 모든 호출 가능 표현식

FP의 함수는 null이나 undefined가 아닌 `사용 가능한 결과`를 낼 경우에민 유의미하며 그 외에는 외부 데이터 변경 등의 사이드이펙트를 일으킴

- 표현식(expresstion) : 값을 내는 함수
- 구문(statement) : 값을 내지 않는 함수

#### 2.3.1 함수를 일급 시민으로

자바스크립트 함수는 실제로 객체이므로 `일급`

#### 2.3.2 고계함수

`고계함수(high-order function` 

함수 인수로 전달하거나 함수를 반환받을 수 있는 함수

> Before

```js
function printPeopleInTheUs(people){
    for (let i=0; i<people.length; i++){
        var thisPerson = people[i];
        if(thisPerson.address.country === 'US'){
            console.log(thisPerson); //각 객체의 toString 메서드를 호출
        }
    }
}
printPeopleInTheUs([p1,p2,p3]); //Person 인스턴스

//다른 나라 거주자도 보여달라
//고계함수 printPeople에 보내기

function printPeople(people,action){
    for (let i=0; i<people.length; i++){
        action(people[i]);
    }
}

function action(person){
    if(person.address.country === 'US'){
        console.log(person);
    }
}

printPeople(people,action)
```

> After / PrintPeople Refactoring

```js
function printPeople(people,selector,printer){
    people.forEach(function(person){
        if(selector(person)){
            printer(person);
        }
    });
}
const inUs = person => person.address.country == 'US';
printPeople(people, inUs, console.log); //선언적 패턴
```

- 데이터를 고르는 기준을 재빨리 구성 가능
- 출력 대상을 바꾸는 일이 자유로움


#### 2.3.3 함수 호출 유형

전역, 메서드, 생성자로...

함수형 코드에서는 this를 쓸 일이 거의 없으며 지양

#### 2.3.4 함수 메서드

---

### 2.4 클로저와 스코프

```js
function zipCode(code, location){
    let _code = code;
    let _location = location || '';

    return {
        code: function(){
            return _code;
        },
        location: function(){
            return _location;
        }
    }
}

const princetonZip = zipCode('08123','3345');
princetonZip.code(); //08123

//함수 스코프 밖에 선언된 변수에 마음대로 접근 가능
```

`클로저`
- 함수를 선언할 당시의 환경에 함수를 묶어둔 자료구조
- 함수 선언부의 물리적 위치에 의존하므로 `정적 스코프` 혹은 `어휘 스코프`
- 함수가 자신을 둘러싼 주변 상태에 접근 가능하므로 명확하고 가독성 높은 코드 작성
- 고계함수를 응용한 함수형 프로그래밍, 이벤트 처리 및 콜백, 프라이빗 변수 모방 등 유용

```js
var outerVar = 'Outer';
function makeInner(params){
    var innerVar = 'Inner';

    function inner(){
        console.log(
            `outerVar, innerVar, params가 보여요`);
        )
    }
    return inner;
}
var inner = makeInner('Params');
inner();
//makeInner가 반환한 함수가 자신이 선언되었던 스코프에 존재했던 변수들을 기억하여 붙잡아둠
```

#### 2.4.1 전역 스코프의 문제점

- namespace 충돌 소지가 높음
- 다른 파일에서 선언된 변수, 함수를 예기치 않게 override 하는 문제
- 코드가 많아질수록 복잡도가 높아짐
- 외부에 의존하게 되어 side effect 유발

#### 2.4.2 자바스크립트의 함수 스코프

- 함수 내부에 선언된 변수는 모두 해당 함수의 지역 변수
- 다른 곳에서는 안보이고, 함수가 반환되는 시점에 사라짐

```js
function doWork(){
    let student = new Student(...);
    let address = new Address(...);
}
//student, address는 doWork함수에 바인딩된 지역 변수 
//함수 밖에서 접근 불가
```
**자바스크립트 스코프 작동 로직**

- 1.변수의 `함수 스코프`를 체크
- 2.지역 스코프에 없으면 `자신을 감싼 바깥쪽 어휘 스코프`로 이동해서 `전역 스코프`에 도달할 때까지 변수 레퍼런스를 계속 찾음
- 3.그래도 참조하는 `대상이 없으면 undefined` 반환


#### 2.4.3 의사 블록 스코프

```js
var arr = [1,2,3,4];

function processArr(){
    function multipleBy10(val){
        i = 10; //2.여기서 루프카운터의 i를 변경하여 10이 되어버림
        return val * i;
    }
    for (var i=0; i<arr.length; i++){ //1. i는 최상단으로 호이스팅
        arr[i] = multipleBy10(arr[i]);
    }
    return arr;
}

processArr(); //[10,2,3,4]

//루프 카운터 i는 processArr 함수의 최상단으로 이동하여 선언되고
//multipleBy10 함수의 클로저에 포함된다.
//var 누락으로 루프카운터의 i가 10으로 변경되어 버림
```

es6 let 블록 바인딩

```js
for(let i=0; i<arr.length; i++){
    // ...
}
i; // i === undefined
```

> ES6 이전

```js
for(var i=0; i<10; i++){
    setTimeout(function(){
        console.log('숫자:'+i);
    },1000);
}
//숫자10 만 10번 찍힘
```

> ES6 이후

```js
for(let i=0; i<10; i++){
      setTimeout(function(){
        console.log('숫자:'+i);
    },1000);  
}
//숫자:0
//숫자:1
//...
//숫자:10
```

#### 2.4.4 클로저 응용

- 프라이빗 변수 모방
- 서버 측 비동기 호출
- 가상의 블록 스코프 변수 생성

**1.프라잇 변수 모방**

- 모듈패턴 : 전체 모듈의 프라이빗 메서드와 데이터를 숨길때 클로저를 적극 활용
- 즉시 실행함수 immediately-invoked function expression (**IIFE**)  : 내부 변수를 캡슐화하면서 전역 레퍼런스 개수를 줄이고 외부에는 필요한 기능만 표출하기 위함

```js
var MyModule = (function MyModule(export){
    let _myPrivateVar = ...;

    export.method1 = function(){
        //작업수행
    };
    export.method2 = function(){
        //작업수행
    };
    return export;
}(MyModule || {}));

//method1은 MyModule.method1()로 호출
```

- myModule 객체는 전역 스코프에 생성
- 함수 표현식은 스크립트가 적재되는 동시에 실행
- _myPrivateVar 프라이빗 변수는 함수 스코프 안에 국한

**2.서버 측 비동기 호출**

고계함수를 통해 다른 함수에 콜백으로 건넴

**3.가상의 블록 스코프 변수를 생성**

```js
arr.forEach(function(elem, i){
    ...
});
//클로저와 함수 스코프를 활용한 forEach
```

---

### 정리

- 자바스크립트는 OOP와 FP 양쪽 다 가능한 언어
- OOP에 불변성을 도입하면 함수형 프로그래밍을 섞어 쓸수 있음
- 고계/일급 함수는 함수형 자바스크립트를 구사하는 근간
- 클로저는 정보 감춤, 모듈 개발, 여러 자료형에 걸쳐 굵게 나뉜 함수에 원하는 기능을 매개변수로 넘기는 등 다양하게 쓰임

---

### 참고

- [coeburst_understand closures in javascript](https://codeburst.io/understand-closures-in-javascript-d07852fa51e7)
- [freecodecamp_whats a javascript closure](https://medium.freecodecamp.org/whats-a-javascript-closure-in-plain-english-please-6a1fc1d2ff1c)
- [freecodecamp_lets learn javascript closures](https://medium.freecodecamp.org/lets-learn-javascript-closures-66feb44f6a44)
- [w3schools_js function closures](https://www.w3schools.com/js/js_function_closures.asp)

---

### week1 문제

[quest1](https://stackblitz.com/edit/quest1)

---

### week2 문제

콘솔에 뭐가 찍힐지 생각해보기

```js
let a = 1;
const function1 = function() {
  console.log(a);
  a = 2
}
a = 3;
const function2 = function() {
  console.log(a);
}
function1();
function2();
```

)](---
layout: post
title: Functional Programming
tags: 
- FP
- javascript
- 함수형 자바스크립트
published: false
---

FP STUDY

# Part1 함수형으로 사고하기
## Chapter2 고계 자바스크립트

date : 19.02.25


> 개발자들은 절차적, 함수형, 객체지향형 접근 방법이 들어 있는 손가방에서 적절히 골라 섞어 쓰면 됩니다.

 
---
### 2.1 왜 자바스크립트인가?

자바스크립트 함수는 주요 작업 단위로서 할일을 시키고, 객체 정의, 모듈 생성, 이벤트 처리를 함

함수형 프로그래밍에 걸맞은 화살표 함수, 상수, 이터레이터, 프라미스 등 기능 추가되며 꾸준히 개선중

---

### 2.2 함수형 대 객체지향 프로그래밍

객체지향과 함수형의 가장 중요한 차이점은 데이터(객체 속성)와 기능(함수)를 조직하는 방법

**객체지향 프로그램**
- 명령형 코드로 이루어짐
- 인스턴스 메서드를 통해 가변 상태를 노출하고 조작 가능
- 객체 기반의 캡슐화에 지나치게 의존한 채 가변 상태의 무결성을 유지
- 모든 추상화의 주요 형태가 객체
- 잘게 나뉜 기능을 구현하기 위해 특수한 자료형을 생성
- 특정 기능이 구현된 여러 자료형을 논리적으로 연결해서 사용
- 메서드에 상속 계층을 두고 데이터를 서로 단단히 묶는 일에 열중

**함수형 프로그램**
- 호출자로부터 데이터를 숨길 필요 없이 아주 단순한 자료형만을 대상
- 데이터와 기능을 느슨하게 결합
- 여러 자료형에 두루 적용 가능하고 굵게 나뉜 연산에 더 의존
- 함수는 추상화 형태
- 합성을 통해 자료형에 수행할 연산을 묶음
- 다양한 자료형을 아우르는 다형성 함수를 선호
- this는 가급적 사용하지 않음
- 객체 데이터가 특정 코드에 종속되지 않아 재사용성, 유지보수성이 좋음


**객체지향, 함수형 프로그래밍의 주요 특징**

 비교| 함수형 | 객체지향형
---- | ---- | ----
합성 단위 | 함수 | 객체(클래스)
프로그래밍 스타일 | 선언적 | 명령형
데이터와 기능 | 독립적인 순수함수가 느슨하게 결합 | 클래스 안에서 메서드와 단단히 결합
상태관리 | 객체를 불변 값으로 취급 | 인스턴스 메스드를 통해 객체를 변이
제어 흐름 | 함수와 재귀 | 루프와 조건 분기
스레드 안전 | 동시성 프로그래밍 가능 | 캡슐화 어려움
캡슐화 | 모든것이 불변이라 불필요 | 데이터 무결성을 지키기 위해 필요

#### 2.2.1 자바스크립트 객체의 상태 관리

자바스크립트 객체는 너무나 동적이어서 상태 관리는 중요

#### 2.2.2 객체를 값으로 취급

불변 값인데 왜 움직이는 형식이라고 표현한걸까?

#### 2.2.3 가동부를 깊이 동결

객체 상태를 못바꾸게 동결

```js
const person = Object.freeze(new Person('songs', 'hello', '777-77-7777'));
person.firstname = 'Bob'; //에러발생 
//읽기 전용 속성에 값을 할당할 수 없습니다.
```

얕은 동결(shallow freeze) : 최상위 객체만 동결

#### 2.2.4 객체 그래프를 렌즈로 탐색/수정

OOP에서는 메서드를 호출해서 상태적 객체의 내부 내용을 바꾸는 일이 비일비재

같은 코드를 도배하지 않고도 상태적 객체를 불변 상태로 바꿀수 있는 묘안이 필요

`렌즈` 또는 `함수형 레퍼런스`

상태적 자료형의 속성에 접근하여 불변화하는 기법

```js
var person = new Person('songs', 'hello', '777-7777');
var lastnameLens = R.lenseProp('lastname');

//R.set을 호출하면 원래 객체 상태는 그대로 유지한 채 새로운 값이 포함된 객체 사본을 새로 만들어 반환
var newPerson = R.set(lastnameLens, 'Morning', person);
newPerson.lastname; // 'Morning'
person.lastname; // 'songs'
```

물밑에서 조용히 객체를 다룬다..

---

### 2.3 함수

함수: 연산자를 적용하여 평가할 수 있는 모든 호출 가능 표현식

FP의 함수는 null이나 undefined가 아닌 `사용 가능한 결과`를 낼 경우에민 유의미하며 그 외에는 외부 데이터 변경 등의 사이드이펙트를 일으킴

- 표현식(expresstion) : 값을 내는 함수
- 구문(statement) : 값을 내지 않는 함수

#### 2.3.1 함수를 일급 시민으로

자바스크립트 함수는 실제로 객체이므로 `일급`

#### 2.3.2 고계함수

`고계함수(high-order function` 

함수 인수로 전달하거나 함수를 반환받을 수 있는 함수

> Before

```js
function printPeopleInTheUs(people){
    for (let i=0; i<people.length; i++){
        var thisPerson = people[i];
        if(thisPerson.address.country === 'US'){
            console.log(thisPerson); //각 객체의 toString 메서드를 호출
        }
    }
}
printPeopleInTheUs([p1,p2,p3]); //Person 인스턴스

//다른 나라 거주자도 보여달라
//고계함수 printPeople에 보내기

function printPeople(people,action){
    for (let i=0; i<people.length; i++){
        action(people[i]);
    }
}

function action(person){
    if(person.address.country === 'US'){
        console.log(person);
    }
}

printPeople(people,action)
```

> After / PrintPeople Refactoring

```js
function printPeople(people,selector,printer){
    people.forEach(function(person){
        if(selector(person)){
            printer(person);
        }
    });
}
const inUs = person => person.address.country == 'US';
printPeople(people, inUs, console.log); //선언적 패턴
```

- 데이터를 고르는 기준을 재빨리 구성 가능
- 출력 대상을 바꾸는 일이 자유로움


#### 2.3.3 함수 호출 유형

전역, 메서드, 생성자로...

함수형 코드에서는 this를 쓸 일이 거의 없으며 지양

#### 2.3.4 함수 메서드

---

### 2.4 클로저와 스코프

```js
function zipCode(code, location){
    let _code = code;
    let _location = location || '';

    return {
        code: function(){
            return _code;
        },
        location: function(){
            return _location;
        }
    }
}

const princetonZip = zipCode('08123','3345');
princetonZip.code(); //08123

//함수 스코프 밖에 선언된 변수에 마음대로 접근 가능
```

`클로저`
- 함수를 선언할 당시의 환경에 함수를 묶어둔 자료구조
- 함수 선언부의 물리적 위치에 의존하므로 `정적 스코프` 혹은 `어휘 스코프`
- 함수가 자신을 둘러싼 주변 상태에 접근 가능하므로 명확하고 가독성 높은 코드 작성
- 고계함수를 응용한 함수형 프로그래밍, 이벤트 처리 및 콜백, 프라이빗 변수 모방 등 유용

```js
var outerVar = 'Outer';
function makeInner(params){
    var innerVar = 'Inner';

    function inner(){
        console.log(
            `outerVar, innerVar, params가 보여요`);
        )
    }
    return inner;
}
var inner = makeInner('Params');
inner();
//makeInner가 반환한 함수가 자신이 선언되었던 스코프에 존재했던 변수들을 기억하여 붙잡아둠
```

#### 2.4.1 전역 스코프의 문제점

- namespace 충돌 소지가 높음
- 다른 파일에서 선언된 변수, 함수를 예기치 않게 override 하는 문제
- 코드가 많아질수록 복잡도가 높아짐
- 외부에 의존하게 되어 side effect 유발

#### 2.4.2 자바스크립트의 함수 스코프

- 함수 내부에 선언된 변수는 모두 해당 함수의 지역 변수
- 다른 곳에서는 안보이고, 함수가 반환되는 시점에 사라짐

```js
function doWork(){
    let student = new Student(...);
    let address = new Address(...);
}
//student, address는 doWork함수에 바인딩된 지역 변수 
//함수 밖에서 접근 불가
```
**자바스크립트 스코프 작동 로직**

- 1.변수의 `함수 스코프`를 체크
- 2.지역 스코프에 없으면 `자신을 감싼 바깥쪽 어휘 스코프`로 이동해서 `전역 스코프`에 도달할 때까지 변수 레퍼런스를 계속 찾음
- 3.그래도 참조하는 `대상이 없으면 undefined` 반환


#### 2.4.3 의사 블록 스코프

```js
var arr = [1,2,3,4];

function processArr(){
    function multipleBy10(val){
        i = 10; //2.여기서 루프카운터의 i를 변경하여 10이 되어버림
        return val * i;
    }
    for (var i=0; i<arr.length; i++){ //1. i는 최상단으로 호이스팅
        arr[i] = multipleBy10(arr[i]);
    }
    return arr;
}

processArr(); //[10,2,3,4]

//루프 카운터 i는 processArr 함수의 최상단으로 이동하여 선언되고
//multipleBy10 함수의 클로저에 포함된다.
//var 누락으로 루프카운터의 i가 10으로 변경되어 버림
```

es6 let 블록 바인딩

```js
for(let i=0; i<arr.length; i++){
    // ...
}
i; // i === undefined
```

> ES6 이전

```js
for(var i=0; i<10; i++){
    setTimeout(function(){
        console.log('숫자:'+i);
    },1000);
}
//숫자10 만 10번 찍힘
```

> ES6 이후

```js
for(let i=0; i<10; i++){
      setTimeout(function(){
        console.log('숫자:'+i);
    },1000);  
}
//숫자:0
//숫자:1
//...
//숫자:10
```

#### 2.4.4 클로저 응용

- 프라이빗 변수 모방
- 서버 측 비동기 호출
- 가상의 블록 스코프 변수 생성

**1.프라잇 변수 모방**

- 모듈패턴 : 전체 모듈의 프라이빗 메서드와 데이터를 숨길때 클로저를 적극 활용
- 즉시 실행함수 immediately-invoked function expression (**IIFE**)  : 내부 변수를 캡슐화하면서 전역 레퍼런스 개수를 줄이고 외부에는 필요한 기능만 표출하기 위함

```js
var MyModule = (function MyModule(export){
    let _myPrivateVar = ...;

    export.method1 = function(){
        //작업수행
    };
    export.method2 = function(){
        //작업수행
    };
    return export;
}(MyModule || {}));

//method1은 MyModule.method1()로 호출
```

- myModule 객체는 전역 스코프에 생성
- 함수 표현식은 스크립트가 적재되는 동시에 실행
- _myPrivateVar 프라이빗 변수는 함수 스코프 안에 국한

**2.서버 측 비동기 호출**

고계함수를 통해 다른 함수에 콜백으로 건넴

**3.가상의 블록 스코프 변수를 생성**

```js
arr.forEach(function(elem, i){
    ...
});
//클로저와 함수 스코프를 활용한 forEach
```

---

### 정리

- 자바스크립트는 OOP와 FP 양쪽 다 가능한 언어
- OOP에 불변성을 도입하면 함수형 프로그래밍을 섞어 쓸수 있음
- 고계/일급 함수는 함수형 자바스크립트를 구사하는 근간
- 클로저는 정보 감춤, 모듈 개발, 여러 자료형에 걸쳐 굵게 나뉜 함수에 원하는 기능을 매개변수로 넘기는 등 다양하게 쓰임

---

### 참고

- [mozilla/javascript/closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [coeburst_understand closures in javascript](https://codeburst.io/understand-closures-in-javascript-d07852fa51e7)
- [freecodecamp_whats a javascript closure](https://medium.freecodecamp.org/whats-a-javascript-closure-in-plain-english-please-6a1fc1d2ff1c)
- [freecodecamp_lets learn javascript closures](https://medium.freecodecamp.org/lets-learn-javascript-closures-66feb44f6a44)
- [w3schools_js function closures](https://www.w3schools.com/js/js_function_closures.asp)

---

### week1 문제

[quest1](https://stackblitz.com/edit/quest1)

---

### week2 문제

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

document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
document.getElementById('size-16').onclick = size16;
```

`css`
```css
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
}

h1 {
  font-size: 1.5em;
}
h2 {
  font-size: 1.2em;
}
```

---

콘솔에 뭐가 찍힐지 생각해보기

```js
let a = 1;
const function1 = function() {
  console.log(a);
  a = 2
}
a = 3;
const function2 = function() {
  console.log(a);
}
function1();
function2();
```
