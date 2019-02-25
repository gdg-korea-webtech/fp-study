# Part1 함수형으로 사고하기
## Chapter2 고계 자바스크립트

date : 19.02.25

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
