# 비동기 이벤트와 데이터를 관리

웹 클라이언트 쪽에서 해야할 일이 늘어남.

- 구형 웹 미들웨어와의 통신
- 사용자 입력의 효율적인 처리
- (AJAX를 경유한) 원격 서버 통신
- 데이터를 화면에 표시

## 이 장에서 배울 것

- 리액티브 프로그래밍이 무엇인가?
- Promise와 함수형 프로그래밍을 접목시켜서 어떻게 콜백 코드를 보기쉬운 코드로 고칠 것인가?
(async + await도 어떻게 하는지 알아두는게 좋을 듯)

## 골칫덩이 비동기 코드

클라이언트에서 필요한 데이터를 서버에 요청하는 경우, 대부분 비차단 비동기(non-blocking asynchronous) 호출 코드를 구현하여 문제를 해결한다. 이 때,

- 함수간에 일시적 의존 관계가 형성되며
- 어쩔 수 없이 콜백 피라미드의 늪에 빠지게 되고
- 동기/비동기 코드가 섞이게 되는 문제가 생긴다.

### 함수간에 일시적 의존 관계가 형성

일시적 결합(temporal coupling 또는 일시적 응집 temporal cohension)은 어떤 함수를 논리적으로 묶어 실행할 때 발생함. (ex: 데이터가 도착할 때까지, 또는 다른 함수가 실행될 때까지 어떤 함수가 기다려야 하는 경우. IO, 서버에서 데이터를 불러오는 것, 특정 시간 이후에 어떤 작업을 수행하도록 하는 것)
이런 경우 호출부에서는 기다려야 하는 작업이 끝난 이후에 실행해야 하는 동작을 함수로 넘긴다(콜백)

```javascript
getJSON('https://some.url.here', (response) => console.log(response), (error) => console.error(error));

function getJSON(url, onSuccess, onError) {
  let req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url);
  req.onload = function() {
    if (req.status === 200) {
      let data = JSON.parse(req.responseText);
      success(data);
    } else {
      req.onerror();
    }
  }
  req.onerror = function() {
    if (error) {
      error(new Error(req.statusText));
    }
  }
  req.send();
}
```

### 콜백 피라미드의 늪에 빠짐

콜백이 non-blocking을 가능하게 만들지만, 대신 '제어의 역전(inversion of control)'이라는 문제를 일으킨다.(함수형 프로그램에서는 이러한 구조가 문제가 됨. 함수형 프로그램이라면 함수는 서로 독립적이어야 하고, 값을 바로 호출자에 반환해야 하기 때문!) async-await이 좀 더 함수형 프로그래밍에 알맞는 것 같다
이렇게 제어의 역전이 일어나면, callback hell이 생기기 쉽다. (1번 url을 호출한 후 성공하면 2번 url을 호출한다 → 벌써 두개의 콜백이 중첩됨)

```javascript
// 따라가기 어려운 콜백
var selector = document.querySelector;
selector('#search-button').addEventListener('click', function(event) {
    event.preventDefault();

    let ssn = selector('#student-ssn').value;
    if (!ssn) {
      console.log('wrong ssn!');
      return;
    } else {
      getJSON(
        '/students/' + ssn,
        function(info) {
          selector('#student-info').innerHTML = info;
          selector('#student-info').addEventListener(
            'mouseover',
            function() {
              getJSON(
                '/students/' + info.ssn + '/grades',
                function(grades) {
                  // do something with grades;
                },
              );
          });
        },
        function(error) {
          console.error('error');
        },
      );
  }
)
```

### 연속체 전달 스타일 continuation-passing style (CPS)

여러개의 콜백 함수를 개별 함수 또는 람다 표현식으로 나눈 것. 논 블로킹 프로그램의 조각들을 개별 컴포넌트르 분리하기 위한 프로그래밍 스타일. 함수형 프로그래밍으로 가는 중간 단계의 코드.

콜백 함수는 현재 연속체current continuation 이라고 부른다. 이렇게 사용하는 경우 콘텍스트 스택의 효율이 좋음. 다른 함수로 이어지는 과정에서 현재 함수의 콘텍스트를 정리하고 새 콘텍스트를 만들어 다음 함수를 지원하는 식으로 프로그램의 흐름을 이어나간다. 즉, 모든 함수가 꼬리에 꼬리를 무는 형태이다.(꼬리재귀 처럼 스택에 누적헤서 쌓지 않는다는 이야기!)

```javascript
//CPS 스타일로 리팩터링 한, 그나마 조금 나은 코드
var selector = document.querySelector;

selector('#search-button').addEventListener('click', handleClickEvent);

const processGrades = function(grades) {
  // do something with grades;
}

const handleMouseMovement = () => getJSON('/students/' + info.ssn + '/grades', processGrades);

const showStudent = function(info) {
  selector('#student-info').innerHTML = info;
  selector('#student-info').addEventListener('mouseover', handleMouseMovement);
}

const handleError = error => console.error('에러 발생: ' + error.message);

const handleClickEvent = function(event) {
  event.preventDefault();

  let ssn = selector('#student-ssn').value;
  if (!ssn) {
    alert('잘못된 ssn입니다');
    return;
  } else {
    getJSON('students/' + ssn, showStudent, handleError);
  }
}
```

CPS 코딩은 코드에 잔존하는 일시적 의존관계를 척결하고, 비동기 흐름을 선형적인 함수 평가 형태로 둔갑시키는 능력이 있다. 그러나 코딩방식이 썩 알아보기 좋은 것도 아닌 듯 하다 -> 시간이 오래 걸리는 연산을 일급 객체로 만들어보자 (프라미스)

## 비동기 로직을 프라미스로 일급화

- 합성과 무인수 프로그래밍을 이용함
- 중첩된 구조를 보다 선형적으로 흐르게 눌러 편다
- 일시적 결합은 추상하기 때문에 개발자는 신경쓰지 않아도 된다
- 여러 콜백 대신, 단일 함수로 에러 처리 로직을 통합하여 코드 흐름을 원활하게 한다

위와 같은 함수형 프로그래밍의 특징을 보장하기 위해, 프라미스(Promise) 라는 모나드를 이용한다.

`Promise.of('오래걸리는 작업').map(f1).map(f2); // -> Promise(결과)`

프라미스는 오래 걸리는 계산이 끝날 때까지 기다렸다가 미리 매핑한 함수를 실행한다.

반환값이 불확실한 함수를 Maybe, Either 모나드로 감쌌던 것처럼, 시간이 오래 걸림과 동시에 성공 여부가 불확실한 작업을 Promise 모나드로 감싼다.

**프라미스의 상태**는 보류pending, 이룸fulfilled, 버림rejected, 귀결settled 이렇게 네가지이다.

- pending -> fulfilled -> settled
- pending -> rejected -> settled

### 미래의 메서드 체인

```javascript
// Promise로 바꾼 getJSON 함수
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url);
    req.onload = function() {
      if (req.status === 200) {
        let data = JSON.parse(req.responseText);
        resolve(data);
      } else {
        reject(new Error(req.statusText));
      }
    }
    req.onerror = function() {
      if (reject) {
        reject(new Error('IO Error'));
      }
    };
    req.send();
 });
}

getJSON('/students').then(function(students) {
  console.log(R.map(student => student.name, students));
}, function(error) {
  console.log(error.message);
});
```

API를 프라미스화 하면 기존 콜백보다 훨씬 코드를 다루기 쉬워진다.

- 비동기 호출을 중첩하는 대신 then으로 체이닝하고, 비동기 코드를 프라미스 모나드로 추상한다.
- 변수를 선언하고 변이를 일으키는 코드는 모두 없애고 람다 함수를 우선한다.
- 라이브러리의 함수를 이용하여 정렬, 필터링, 매핑 등의 자료 변환 단계를 간소화한다.
- 에러 처리 로직을 제일 마지막의 catch 함수에 몰아 넣는다.
- 데이터를 IO 모나드에 승급하여 부수효과 없이 DOM 에 표시한다.

```javascript
getJSON('/students')
  .then(hide('spinner'))
  .then(R.filter(s => s.address.country === 'US'))
  .then(R.sortBy(R.prop('ssn')))
  .then(R.map(student => {
    return getJSON('/grades?ssn=' + student.ssn)
      .then(R.compose(
        Math.ceil,
        fork(R.divide, R.sum, R.length),
      ))
      .then(grade => (
        IO.of(R.merge(student, {'grade': grade}))
          .map(R.props(['ssn', 'firstname', 'lastname', 'grade']))
          .map(csv)
          .map(append('#student-info'))
          .run()
      ));
  }))
  .catch(function(error) {
    console.error('error', error.message);
  });
```

### 동기/비동기 로직을 합성

모나드는 체이닝 뿐만 아니라 합성 용도로도 효과적으로 사용할 수 있다.

```javascript
const showStudent = R.compose(
  catchP(error),
  then(append('#student')),
  then(csv),
  then(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudentAsync),
  map(checkLengthSsn),
  lift(cleanInput),
);
```

## 느긋한 데이터 생성

**제너레이터generator** 함수: function* 라고 표기하는, 언어 수준에서 지원되는 장치. **yield** 키워드를 만나면 함수 밖으로 잠시 나갔다가 자신의 보관된(전체 지역 변수가 바인딩된) 콘텍스트를 찾아 다시 돌아옴. 함수의 실행 콘텍스트를 잠정 중단했다가 다시 재개하여 제너레이터로 돌아올 수 있다.

쉽게 말해, generator는 iterator를 만들 수 있는데, 이 함수 안에서 yield라는 키워드를 앞에 붙이면 해당 변수가 iterator가 반환하는 값이 된다.

```javascript
function* range(start = 0, finish = Number.POSITIVE_INFINITY) {
  for(let i = start; i < finish; i++) {
    yield i; // 호출자callee로 돌아간 후에도 지역 변수의 바인딩 상태를 모두 기억함
  }
}

const num = range(1);
num.next().value; // 1
num.next().value; // 2
num.next().value; // 3

for (len n of range(1)) { //generator는 iterable이어서 배열처럼 루프 블록 내에 둘 수 있음. (제너레이터 전용 루프문 for ... of를 사용하면 됨)
  console.log(n);
  if (n === threshold) {
    break;
  }
}// -> 1, 2, 3, ...
```

### 제너레이터와 재귀

제너레이터가 다른 제너레이터를 호출하는 것도 얼마든지 가능함.

중첩된 객체 집합을 평평한 모양으로 만들고 싶을 때 (예: 트리순회) 유용하다.

제너레이터는 for ... of 루프문으로 반복할 수 있기 때문에 다른 제너레이터에 위임하는건 마치 두 컬렉션을 병합한 전체 컬렉션을 반복하는 것과 비슷함.

```javascript
function* AllStudentGenerator() {
  yield 'Church';

  yield 'Rosser';
  yield* RosserStudentGenerator(); // yield*로 다른 제너레이터에게 위임한다.

  yield 'Turing';
  yield* TuringStudentGenerator();
  
  yield 'Kleene';
  yield* KleeneStudentGenerator();
}

function* RosserStudentGenerator() {
  yield 'Mendelson';
  yield 'Sacks';
}

function* TuringStudentGenerator() {
  yield 'Gandy';
}

function* KleeneStudentGenerator() {
  yield 'Nelson';
  yield 'Constable';
}

for(let student of AllStudentsGenerator()) {
  console.log(student);
}
/* result
Church
Rosser
Mendelson
Sacks
Turing
Gandy
Kleene
Nelson
Constable
*/

// 재귀로 트리 탐색
function* TreeTraversal(node) {
  yield node.value;
  if (node.hasChildren()) {
    for(let child of node.children) {
      yield* TreeTraversal(child); // yield*로 자신에게 도로 위임한다
    }
  }
}
var root = node(new Person('Alonzo', 'Church', '111-11-1231'));

for(let person of TreeTraversal(root)) {
  console.log(person.lastname);
}
```

### 이터레이터와 프로토콜

제너레이터는 이터레이터iterator와 밀접한 관련이 있음.(당연)

제너레이터 함수는 내부적으로 이터레이터 프로토콜에 따라 yield 키워드로 값을 반환하는 next() 메서드가 구현된 Generator 객체를 반환한다.

이터레이터 객체의 속성은 다음과 같다.

- done: 제일 마지막에 이터레이터가 전달되면 true, 그렇지않으면 false.
- value: 이터레이터가 반환한 값

```javascript
// 제곱수를 구하는 제너레이터를 원시 형태로 구현한 코드
function squares() {
  let n = 1;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return { value: n * n++ };
    },
  };
}
```


**추가** - Generator, Decorator, Symbol 나만 헷갈리는건지 모르겠지만 그래도 정리해본다

- generator: ES6 spec. 지금까지 계속 설명한, 이터레이터를 만드는 함수. `function* 함수명` 형태로 선언.
- decorator: ES6 proposal(*?맞나...? 정식으로 통과되지는 않은 듯*).  선언된 클래스와 그 프로퍼티들을 디자인 시간에 변경할 수 있는 편리한 문법. [참조링크](https://blog-kr.zoyi.co/channel-frontend-decorator/)
- symbol: ES6 spec. 새로운 Primitive Type. `고유한 값`이면서 변화되지 않는 값. [참조링크](http://hacks.mozilla.or.kr/2015/09/es6-in-depth-symbols/)

## RxJS를 응용한 함수형 리액티브 프로그래밍

비동기 프로그램과 이벤트 기반 프로그램을 우아하게 엮을 수 있는 라이브러리.

함수형 프라미스 기반의 예제와 비슷한 방식으로 작동하지만, 더 높은 추상화를 제공하며 더 강력한 연산을 제공한다.

### 옵저버블 순차열로서의 데이터

주요 개념

- 옵저버블Observable: 구독(subscribe) 가능한 모든 객체. (파일 읽기, DB에 쿼리로 질의, 시스템 통지 푸시, 사용자 입력 처리, 원소 컬렉션 탐색, 단순 문자열 파싱 등에서 비롯된 비동기 이벤트 등이 구독 가능한 옵저버블이 됨)
- 리액티브 프로그래밍Reactive Programming은 모든 데이터 제공원(data provider)을 Rx.Observable 객체를 통해 옵저버블 스트림Observable stream이라는 단일 개념으로 일원화환다.
- 옵저버블 스트림: 옵저버블로부터 받은 이벤트를 시간의 흐름에 따라 나열한 이벤트의 순차열.
- 옵저버블 스트림을 추출하기 위해서는 옵저버블을 구독하고 있어야 함

```javascript
// 아래 코드를 실행하면 1, 2, 3 으로부터 옵저버블 순차열을 생성한다.
Rx.Observable.range(1, 3)
  .subscribe(
    x => console.log(`다음: ${x}`),
    err => console.error(`에러: ${err}`),
    () => console.log('완료'),
  );
/* 결과
다음: 1
다음: 2
다음: 3
완료
*/
```

```javascript
// 제곱수 제너레이터를 이용한 예제
const squares = Rx.Observable.wrap(function* (n) {
  for(let i = 0; i <= n; i++) {
    return yield Observable.just(i * i);
  }
});

squares(3).subscribe(x => console.log(`다음: ${x}`));
/* 결과
다음: 1
다음: 4
다음: 9
*/
```

결국 Rx.Observable 로 어떤 옵저저블 객체를 승급하여 관찰된 값에 함수를 매핑/적용해서 원하는 출력을 얻는 것 -> 모나드!

### 함수형 리액티브 프로그래밍

`Rx.Observable`-> map, of, join 등 최소한의 모나드 인터페이스에 해당하는 구현체와 스트림 조작에 특화된 메서드를 가지고 있음.

생각하는 방식이 함수형 프로그래밍과 흡사하여 **함수형 리액티브 프로그래밍 Functional Reactive Programming** 이라는 용어도 생김.

```javascript
// without Rx.Observable
document.querySelector('#student-ssn')
  .addEventListener('change', function(event) {
    let value = event.target.value;
    value = value.replace(/^\s*|\-|\s*$/g, '');
    console.log(value.length !== 9 ? '틀림' : '맞음');
  });

// 예제가 잘못된 것 같아서 고침
// 444 틀림
// 444-44-4444 맞음
```

아래 예제에서는 이벤트와 함수형 프로그래밍을 접목하키 위해 Rx.Observable 을 이용하여 추상화 계층을 둔다. -> 이벤트 처리 코드에서도 함수형 프로그래밍이 가능함.

```javascript
// with Rx.Observable
// 선형적인 비동기 데이터 흐름을 체이닝하여 이벤트를 처리함.
Rx.Observable
  .fromEvent(document.querySelector('#student-ssn'), 'change')
  .map(x => x.target.value)
  .map(cleanInput) // 정규식 체크
  .map(checkLengthSsn) // Either.fromNullable(value) 와 같은 동작을 수행함
  .subscribe(ssn => ssn.isRight ? console.log('valid') : console.log('invalid'));
);
```

### RxJS와 프라미스

RxJS는 모든 프라미스/A+ 호환 객체를 옵저버블 순차열로 변환할 수 있음. 즉, 실행시간이 긴 getJSON 함수를 감싸 귀결 시점에 그 값을 스트림으로 바꾼다.

```javascript
Rx.Observable.fromPromise(getJSON('/students'))
  .map(R.sortBy(R.compose(R.toLower, R.prop('firstname'))))
  .flatMapLatest(student => Rx.Observable.from(student))
  .filter(R.pathEq(['address', 'country'], US))
  .subscribe(
    student => console.log(student.fullname),
    err => console.log(err)
  );
/* 결과
Alonzo Church
Haskell Curry
*/
```