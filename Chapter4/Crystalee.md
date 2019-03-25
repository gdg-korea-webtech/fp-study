# 재사용 가능한, 모듈적인 코드로

## 매서드체인 vs 파이프라인

## 함수 호환 요건

## 커리된 함수를 평가

## 부분 적용과 매개변수 바인딩

### 커링과 부분적용 비교

부분적용(partial application): 함수의 일부 매개변수 값을 처음부터 고정시켜 항수(매개변수의 길이)가 더 작은 함수를 생성하는 기법.

커리된 함수가 사실상 부분 적용된 함수.

#### 커링과 부분적용의 차이

**커링**은 부분 호출할 때마다 단항 함수를 중첩 생성함. 이들을 단계별로 함성하여 최종 결과를 낸다. 여러 인수를 부분 평가하는 식으로도 변용 가능. 커링은 **부분적용을 자동화**한 것.

**부분적용**은 함수 인수를 미리 정의된 값으로 할당한 후, 인수가 적은 함수를 새로 만든다 -> 함수는 자신의 클로저에 고정된 매개변수를 갖고 있으며, 후속 호출 시 이미 평가를 마친 상태이다.

```javascript
const logger = function(appender, layout, name, level, message) {
  const appenders = {
    'alert': new Log4js.JSAlertAppender(),
    'console': new Log4js.BrowserConsoleAppender(),
  };
  const layouts = {
    'basic': new Log4js.BasicLayout(),
    'json': new Log4js.JSONLayout(),
    'xml': new Log4js.XMLLayout(),
  };
  const appender = appenders[appender];
  appender.setLayout(layouts[layout]);
  const logger = new Log4js.getLogger(name);
  logger.addAppender(appender);
  logger.log(level, message, null);
};

// curry
const curryLog = R.curry(logger)('alert', 'json', 'FJS 커링');
curryLog('ERROR', '에러발생'); // 1
const logError = R.curry(logger)('alert', 'json', 'FJS 커링', 'ERROR');
logError('에러발생'); // 2

// partial
const partialLog = _.partial(logger, 'alert', 'json', 'FJS 부분 적용');
const consoleErrorLog = _.partial(partialLog, 'ERROR');
consoleErrorLog('에러발생'); // 3

curryLog('some message'); // 4
partialLog('some message'); // 5


// 1, 2, 3 모두 결과는 동일함
// 4의 경우, R.curry('alert', 'json', 'FJS 커링', 'some message') 의 결과와 동일한 함수가 반환된다.
// 5의 경우, logger('alert', 'json', 'FSJ 부분 적용' 'undefined', '에러발생') 으로 호출된 결과가 반환된다.

const bindLog = _.bind(logger, undefined, 'console', 'json', 'FJS 바인딩');
bindlog('ERROR', '에러발생'); // undefined 자리에 첫번째로 받은 인수('ERROR')를 넣고, 두번째로 받은 인수를 message로 사용한다.(partial에서 _를 placeholder로 이용하는 것과 비슷한 용도로 undefined를 이용함)
```

### 언어의 핵심을 확장

> 부분 적용은 String, Number 같은 핵심 자료형을 확장하여 언어의 표현성을 풍부하게 할 목적으로 사용할 수 있다

쉽게 말하면, 기본 자료형의 prototype에 원하는 함수를 추가하여 사용할 수 있다는 이야기.

`String.prototype.someFunction` 을 만들어서, `'hello'.someFunction()` 이렇게 호출 가능하게 할 수 있다!

```javascript
String.prototype.first = _.partial(String.prototype.substring, 0, _);
'Functional Programming'.first(3); // -> 'Fun'

String.prototype.asName = _.partial(String.prototype.replace, /(\w+)\s(\w+)/, '$2, $1');
'Alonzo Church'.asName(); // -> 'Church, Alonzo'

String.prototype.explode = _.partial(String.prototype.match, /[\w]/gi);
'ABC'.explode(); // => ['A', 'B', 'C']

String.prototype.parseUrl = _.partial(String.prototype.match, /(http[s]?|ftp):\/\/([^:\/\s]+)\.([^:\/\s]{2,5})/);

'http://example.com'.parseUrl(); // -> ['http://example.com', 'http', 'example', 'com']
```

**하지만** 주의해야함(이후 버전의 JavaScript에서 해당 이름과 같은 prototype함수가 추가되는 경우 충돌할 수 있으므로)

```javascript
// 이런식으로 확인하고 사용하는게 좋을 듯 하다
if (!String.prototype.someFunction) {
  String.prototype.someFunction = _.partial(...);
}
```

### 지연된 함수에 바인딩

>소유 객체를 전제로 메서드 바인딩을 다룰 때에는 함수 바인딩으로 콘텍스트 객체를 세팅하는 일이 중요하다

다시말해, this 바인딩이 중요하다는 이야기.

```javascript
// 바인딩 한 함수를 부분적용하는 예제
const Scheduler = (function() {
  const delayedFn = _.bind(setTimeout, undefined, _, _); // 여기서의 undefined는 context를 의미함. undefined를 넘기면 window가 this객체에 바인딩된다. 만약 다른 객체를 바인딩하고 싶다면 undefiend가 아닌 특정 객체를 넘기면 된다.
  
  // 1 - 위에서 바인딩할때 비워두었던 두개의 placeholder중 맨 마지막 인수인 지연시간을 채우고, 그 후에 실행할 함수를 넘기는 부분은 placeholder를 채워 호출부에서 넣을 수 있도록 한다.
  // 2 - 위에서 바인딩할때 비워두었던 두개의 placeholder 모두 호출시에 받도록 다시 placeholder를 채워둔다.
  return {
    delay5: _.partial(delayedFn, _, 5000), // 1
    delay: _.partial(delayedFn, _, _), // 2
  }
});

Scheduler.delay5(function() {
  consoleLog('5초 후에 실행됨');
});
Scheduler.delay(function() {
  consoleLog('지정한 시간(1.2초) 후 실행됨');
}, 12000);
```

커링, 부분적용 모두 호출 시의 항수를 줄여주기 때문에 함수를 다루기 쉽게 도와준다.

> 커링과 부분적용을 이용하면 다항함수를 호출하는 대신 여러개의 단항함수를 호출하는 방식으로 바꿀 수 있음 -> 함수를 다루기 더 쉬워지고, 스코프를 분리할 수 있고, 함수의 합성을 단순화할 수 있다.

## 함수 파이프라인을 합성

### HTML 위젯에서 합성하기

작은 HTML Element 들의 합성(Composition)으로 큰 Element를 만든다.

```javascript
// 재귀적인 튜플을 이용하여 null로 끝나는 리스트를 만들 수 있다.
const Node = Tuple(Object, Tuple);
const element = R.curry((val, tuple) => new Node(val, tuple));
```

### 함수 합성: 서술과 평가를 구분

함수 합성: 복잡한 작업을 한데 묶어 간단한 작업으로 쪼개는 과정. 함수의 출력과 입력을 연결하의 진정한 **함수 파이프라인**을 만들 수 있다.

```text
// 아래와 같은 경우에만 f◦g 가 가능함. 다시말해 f(g(<어떤 매개변수>)) 가 가능함.
g:: A -> B
f:: B -> C
```

**compose 안에 들어가는 놈을 뒤에서부터 하나씩 실행**한다.

`f g = f(g) = compose :: ((B -> C), (A -> B)) -> (A -> C)`

```javascript
function compose(/* 함수 */) {
  let args = arguments;
  let start = arg.length;
  return function() {
    let i = start;
    let result = args[start].apply(this, arguments); // 합성된 함수가 평가될 때 넘기는 매개변수를 이용하여 합성했던 함수 중 맨 마지막 파라미터인 함수를 호출함
    while(i--) {
      result = args[i].call(this.result);
    }
    return result;
  }
}
```

```javascript
// 사용 예시
const str = 'We can only see a short distance ahead but we cas see plenty there that needs to be done';

const explode = (str) => str.split(/\s+/);
const count = (arr) => arr.length;

// explode가 array를 반환하고, count가 array를 매개변수로 받기 때문에 합성 가능함!
const countWords = R.compose(count, explode); // 이 때 평가하지 않음. 평가를 기다리는(호출되기를 기다리는) 다른 함수를 반환한다.

countWords(str); // -> 19. 실제로 이 라인이 호출되어야 평가를 함.
```

전체 프로그램을 개발할 때에도 작은 단위의 프로그램(모듈)을 **합성**하여 개발할 수 있다.

합성은 결합 가능한 연산(conjunctive operation)이라서 논리 AND 연산자로 원소를 합칠 수 있다. -> 이 덕분에 뒤에 나오는 함수 조합기를 이용할 수도 있음.

### 함수형 라이브러리로 합성

각자 사용하는 라이브러리(R, lodash)에 맞게 잘 찾아서 사용하면 될듯(공식문서 잘 읽어보기!)

### 순수 / 불순함수 다루기

불순(impure)한 코드를 아예 없앨 수는 없으므로, 불순한 코드를 순수한 코드와 잘 분리하는 것이 필요하다. (나중에 테스트를 위해서라도!)

```javascript
// findObject :: DB -> String -> Object
const findObject = R.curry((db, id) => {
  const obj = find(db, id);
  if (obj === null) {
    throw new Error('ID가 [${id}]인 객체는 없습니다.');
  }
  return obj;
});

// findStudent :: String -> Student
const findStudent = findObject(DB('students'));

const csv = ({ssn, firstname, lastname} => {
  `${ssn}, ${firstname}, ${lastname}`;
});

// append :: String -> String -> String
const append = R.curry((elementId, info) => {
  document.querySelector(elementId).innerHTML = info;
  return info;
});

// showStudent :: String -> Integer
const showStudent = R.compose(
  append('#student-info'),
  csv,
  findStudent,
  normalize,
  trim,
);

showStudent('44444-44444 '); // -> 444-44-4444, Alonzo, Church
```

### 무인수 프로그래밍

## 함수 조합기로 제어 흐름을 관리

함수 조합기(function combinator): 명령형 코드에서 `if-else`, `for`와 같은 절차적 제어 장치를 대체하여 함수형 코드에서 사용할 수 있는 대안

**조합기**: 함수 또는 다른 조합기 같은 기본 장치를 조합하여 제어 로직처럼 작동시킬 수 있는 **고계함수**. 대부분 합수형 프로그램이 잘 흘러가도록 조정하는 역할을 한다. (e.g. `componse`, `pipe`, `identify`, `tap`, `alternation`, `sequence`, `fork`, `join`)

### `identify` (항등 - I 조합기)

`identify :: (a) -> a`

주어진 인수와 똑같은 값을 반화하는 함수. argument를 받아서 어떤 동작을 수행하고 다시 같은 argument를 반환한다.

### `tap` (탭 - K 조합기)

코드 추가 없이 void형 함수를 연결하여 합성할 때 유용함(e.g. 로깅, 파일/HTML/페이지 쓰기 등). 자신을 함수에 넘기고 자신을 돌려받는다.

`tap :: (a -> *) -> a -> a`

```javascript
const debugLog = _.partial(logger, 'console', 'basic', 'MyLogger', 'DEBUG');

const debug = R.tap(debugLog);
const cleanInput = R.componse(normalize, debug, trim);

// 여기의 debug는 리턴값을 바꾸지 않음. 매개변수를 그대로 return
const isValidSsn = R.compose(debug, checkLengthSsn, debug, cleanInput);
```

### `alt` (선택 - OR 조합기)

함수 호출 시 기본 응답을 제공하는 **단순 조건 로직**을 수행함.

함수 2개를 인수로 받아 첫번째 함수의 결과가 false가 아니거나, falsy하지 않은 값이면 첫번째 함수의 결과를 리턴하고 아니면 두번째 함수의 결과를 리턴함

```javascript
const alt = function(func1, func2) {
  return function(val) {
    return func1(val) || func2(val);
  }
}

//  ramda 표현식
const alt = R.curry((func1, func2, val) => func1(val) || func2(val));
```

### `seq` (순차열 - S 조합기)

함수 순차열을 순회함. 2개 또는 더 많은 함수를 인수로 받아 동일한 값에 대하여 각 함수를 차례로 실행하는 또 다른 함수를 반환한다.

```javascript
const seq = function(/*함수*/) {
  const funcs = Array.prototype.slice.call(arguments);
  return function(val) {
    funcs.forEach(function(fn) {
      fn(val);
    });
  };
};
```

정해진 일을 하나씩 차례로 수행하기는 하나, 값을 반환하지는 않는다. seq를 중간에 쓰고싶다면 tap 나머지 함수와 연결하면 된다.

### `fork` (포크|조인 조합기)

하나의 자원을 두 가지 방법으로 처리 후 그 결과를 다시 조합한다.

하나의 join 함수와 주어진 입력을 처리할 종단 함수(terminal function) 이렇게 두가지를 매개변수로 받는다. 분기된 각 함수의 결과는 제일 마지막에 join 함수의 매개변수로 전달됨.

```javascript
const fork = function(join, func1, func2) {
  return(function(val) {
    return join(func1(val), func2(val));
  });
};
```

```javascript
//예제
const computeAverageGrade = R.compose(getLetterGrade, fork(R.divide, R.sum, R.length));
computeAverageGrade([99, 80, 89]); // -> 'B'

const eqMedianAverage = fork(R.equals, R.median, R.mean);
eqMedianAverage([80, 90, 100]); // -> True
eqMedianAverage([81, 90, 100]); // -> False
```

- 조합기를 쓰면 자유롭게 무인수 프로그래밍 가능.
- 조합기는 순수하기 때문에 다른 조합기와 재합성이 가능함

---
ch3 문제
[링크](https://stackblitz.com/edit/fp-study-today-nvhmge)
