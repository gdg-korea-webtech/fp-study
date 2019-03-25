# Part2 함수형으로 전환하기
## Chapter5 복잡성을 줄이는 디자인 패턴

date : 19.03.25

---

> 널 참조는 10억 달러짜리 실수다

### 5.1 명령형 에러 처리의 문제점

#### 5.1.1 try-catch 에러 처리

안전하지 않은 코드 조각은 둘러싸자
```js
try {
    var student = findStudent('444-44-4444');
}
catch (e){
    console.log('error: ' + e.message);
}
```

#### 5.1.2 함수형 프로그램은 왜 예외를 던지지 않을까?

**예외를 던지는 함수의 특징**
- 다른 함수형 장치처럼 합성이나 체이닝 불가
- 예외를 던지는 것은 함수 호출에서 빠져나갈 구멍을 찾는 것이므로 단일한, 예측 가능한 값을 지향하는 참조 투명성 원리에 위배
- 스택이 풀리면 함수 호출 범위를 벗어나 전체 시스템에 영향을 미치는 사이드이펙트 발생
- 에러를 처리하는 코드가 함수를 호출한 지점과 동떨어져 있어서 비지역성 원리에 위배
- catch블록을 선언해 특정 예외를 붙잡아 처리하는 데 낭비하면서 호출자의 부담 가중
- 다양한 에러 조건을 처리하는 블록들이 중첩되어 사용이 어려움

예외를 사용하면 효율적인 경우도 있지만 과용해선 안됨..TypeError..!

#### 5.1.3 null 체크라는 고질병

> try-catch나 null 체크 코드로 감싸는 건 겁쟁이나 하는 짓입니다. 

### 5.2 더 나는 방안: 함수자

- 잠재적으로 위험한 코드 주위에 안전망을 설치
- 위험한 코드를 감싼다는 개념은 그대로 가져가되 try-catch 블록은 제거 가능
- 함수형 자료형을 사용하여 불순함과의 분리를 일급 시민으로 만듦

#### 5.2.1 불안전한 값을 감쌈

컨테이너화된(감싸진) 값에 접근하는 유일한 방법은 **연산을 컨테이너에 매핑** 하는 것

> 에러가 날지 모를 값을 래퍼 객체로 감싼다
```js
//값을 래퍼로 감싸주는 도우미 함수
const wrap = (val) => new Wrapper(val); 
```

- 값에 접근하는 건 얼마든지 가능하지만 어떤 값이 컨테이너 속으로 들어가면 절대로 갑을 직접 조회/변경할 수 없음 
- wrapper형은 `map`을 통해 값에 접근하거나 값을 변경할 수 있다.
- identity 함수를 컨테이너에 매핑하여 마치 컨테이너에 있던 값처럼 값을 추출

컨테이너 안에 넣어 보호된 값을 얻고 싶은 코드는 무조건 `Wrapper.map`을 통해서만 **컨테이너 내부에 손을 뻗칠 수 있는** 구조로 만들 수 있다.

>map 변형 fmap
```js
//변환된 값을 호출부에 반환하기 전에 컨테이너로 감쌈
fmap (f){
    return new Wrapper(f(this._value));
}
```

컨테이너를 열고 그 안에 보관된 값에 함수 적용 후, 결과를 동일한 형식의 새 컨테이너에 넣고 닫는 것으로 마무리 -> 함수자!

#### 5.2.2 함수자의 세계로

**함수자** : 값을 래퍼 안으로 <u>승급</u>한 다음 수정하고 다시 래퍼에 넣을 목적을 염두에 둔 함수 매핑이 가능한 자료구조
  - `승급` : 어떤 값을 래퍼로 감싸 일반화(에러가 날 가능성까지 감안하여 안전하게 감싸는)하는 행위

- 함수를 자유자재로 매핑하여 값을 반환
- 같은 형식의 컨테이너로 결과를 감싸므로 계속해서 체이닝 가능
- map, filter, compose의 방식
- 부수효과가 없음
- 합성이 가능
- **한 형식의 함수를 다른 형식의 함수로 매핑**

`모나드` : 함수자가 건드리는 컨테이너

- 어떤 자원을 추상하여 그 속에 든 데이터를 안전하게 처리
- 안전하게 에러를 전파, 얌전하게 실패

### 5.3 모나드를 응용한 함수형 에러 처리

#### 5.3.1 모나드: 제어 흐름에서 데이터 흐름으로

```js
const isEven = (n) => Number.isFinite(n) && (n % 2 == 0);
const half = (val) => isEven(val) ? wrap(val/2) : empty();

half(4); //-> Wrapper(2)
half(2); //-> Empty
```

- 컨테이너 안으로 값을 승급하고 어떤 규칙을 정해 통제한다는 생각으로 자료형을 생성하는 것이 모나드
- 자신의 상대가 어떤 값인지는 모른 채 일련의 단계로 계산 과정을 서술하는 디자인 패턴
- 함수자로 값을 보호하되, 합성을 할 경우 데이터를 안전하고 부수효과 없이 흘리기 위함

```js
half(4).fmap(plus3); //-> Wrapper(5)
half(3).fmap(plus3); //-> Empty
//잘못된 입력이 넘어와도 컨테이너가 알아서 함수 매핑
```

- **모나드** : 모나드 연산을 추상한 인터페이스를 제공
- **모나드형** : 모나드 인터페이스를 실제로 구현한 형식

**모나드형은 다음 인터페이스를 준수**
- 형식 생성자 : 모나드형을 생성
- 단위 함수 : 어떤 형식의 값을 모나드에 삽입 of
- 바인드 함수 : 연산을 서로 체이닝 map
- 조인 연산 : 모나드 자료구조의 계층을 눌러 평탄화, 반환 함수를 다중 합성할때 중요


#### 5.3.2 Maybe와 Either 모나드로 에러를 처리

유효한 값을 감싸기도 하지만 값이 없는 상태 null, undefined를 모형화함, 
`Maybe/Either`형으로 에러를 **구상화**하여 처리

- 불순 코드를 격리
- null 체크 로직을 정리
- 예외를 던지지 않음
- 함수 합성 지원
- 기본값 제공 로직을 한곳에 모음

**null체크를 Maybe로 일언화**

주목적은 null 체크 로직을 효과적으로 통합

- Just(value): 존재하는 값을 감싼 컨테이너
- Nothing(): 값이 없는 컨테이너, 추가 정보 없이 실패한 컨테이너, 존재하지 않는 값에도 함수 적용 가능

Maybe는 널 허용 값(null, undefined)을 다루는 작업을 명시적으로 추상하여 비즈니스 로직에 전념할수 있게 함

결과가 불확실한 호출을 할때...

```js
const getCountry = (student) => student
      .map(R.prop('school'))
      .map(R.prop('address'))
      .map(R.prop('country'))
      .getOrElse('존재하지 않는 국가');

      //하나라도 Nothing이면 이후 연산은 전부 건너뜀
```

```js
const safeFindObect = R.curry((db, id) => Maybe.fromNullable(find(db, id));
//함수명은 safe를 붙였고 반환값은 모나드로 감쌈
//함수가 잠재적으로 위험한 값을 지니고 있을지 모른다는 점을 호출자에게 분명하게 밝힘
```

>함수승급
```js
//일반함수라도 컨테이너에서 작동하는 안전한 함수로..기존코드를 굳이 바꾸지 않고 사용 가능
const lift = R.curry((f, value) => Maybe.fromNullable(value).map(f);

//함수 본체 안에 모나드를 직접쓰지 않고
const findObject = R.curry((db, id) => find(db, id);

//원래 모습을 그대로 유지한체 lift를 이용해 함수를 컨테이너로 보냄
const safeFindObject = R.compose(lift(console.log), findObject);
safeFindObject(DB('student'), '444-44-4444');
```

--- 

**Either로 실패를 복구**

- 절대로 동시에 발생하지 않는 두 값 a,b를 논리적으로 구분한 자료구조, 다음 두 경우를 모형화한 형식
  - Left(a): 에러 메시지 또는 예외 객체를 담음
  - Right(b): 성공한 값을 담음
- 오른쪽 피연산자를 중심으로 작동, 컨테이너에 함수를 매핑하면 항상 하위형 `Right(b)`에 적용됨 
- 계산 도중 실패할 경우 원인에 관한 추가 정보를 결과와 함께 제공할 목적으로 사용
- 복구 불가한 예외 발생시 던질 예외 개체를 왼쪽에 둠
- 예외가 날지 모를, 예측하기 어려운 함수로부터 코드를 보호하기 위해 사용

#### 5.3.3 IO 모나드로 외부 자원과 상호작용

>실행 대기하는, 체이닝 가능한 함수로
```js
const readDom = _.partial(read, document);
const writeDom = _.partial(write, document);
```

>각 단어의 첫자를 대문자로
```html
<div id="student-name">songs hello</div>
```

```js
const changeToStartCase = 
  IO.from(readDom('#student-name'))
    .map(_.startCase) //변환 작업 매핑
    .map(writeDom('#student-name'));  //불순한 연산..

changeToStartCase.run();

//-> <div id="student-name">Songs Hello</div>
//참조 투명한 방향으로 처리..
```

컨테이너에 매핑하는 변환함수가 dom을 읽고 쓰는 로직과 분리되어 있어서 HTML 요소의 내용을 얼마든지 변환할 수 있고, 한방에 실행되므로 연산 중간에 문제가 생길 일이 없음


### 5.4 모나드 체인 및 합성

- 모나드는 부수효과를 억제하므로 합성 가능한 자료구조로 활용 가능
- 적은 코드만으로도 매끄럽고 표현적인 에러 처리 장치를 통해 안전한 합성 도모

**프로그래밍 가능한 콤마** : 한 표현식에서 다른 표현식으로 데이터가 흘러가는 과정을 모나드로 제어하는 코딩 스타일

```js
const getOrElse = R.curry((message, container) => container.getOrElse(message));

// 학생 레코드를 검증/조회하는 로직을 전부 실행
const showStudent = R.compose(
  map(append('#student-info')),
  liftIo,
  getOrElse('학생을 찾을 수 없습니다.'),
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudent),
  chain(checkLengthSsn),
  lift(cleanInput)
);

//과정이 끝나면 데이터를 화면에 출력하지 않고 일단 대기
//데이터는 IO모나드에 승급된 상태라서 run 함수를 호출하면 내부(클로저)에 느긋하게 보관된 데이터가 화면에 출력

showStudent(studentId).run(); //-> 444-44-4444, Songs, Hello
```
 > - 합성: 프로그램 흐름을 제어
 > - 모나드: 데이터 흐름을 제어

 ### 5.5 마치며

 - ~~객체지향 방식의 예외 처리~~는 try-catch 로직으로 예외를 붙잡아 처리해야 하므로 담당해야 할 일이 많음
 - 하나의 참조 투명한 프로세스에서 가능한 변이를 **감싸는 패턴(컨테이너화)** 은 부수효과 없이 코드 작성 가능
 - **함수자**를 써서 함수를 컨테이너에 매핑하여 **불변적으로 객체를 접근/변경**
 - **모나드**는 함수형 프로그래밍의 디자인 패턴, 함수 간에 데이터가 안전하게 흘러가도록 조정하여 **복잡도를 낮추는** 역할
 - `Maybe, Either, IO`등의 모나드형을 교차 배치하면 탄력적, 빈틈없이 함수 합성 가능
 
---

### Reference
- [monad 그림으로 이해하기](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html#monads)
- [basic-monads-in-javascript](https://dev.to/rametta/basic-monads-in-javascript-3el3)
- [functors-monads-and-promises](https://dev.to/joelnet/functional-javascript---functors-monads-and-promises-1pol)
- [state-monad-in-javascript](https://egghead.io/courses/state-monad-in-javascript)
- [monad sample](https://www.toptal.com/javascript/option-maybe-either-future-monads-js)
- [monad-pattern-for-functional-programming-in-es6](https://moduscreate.com/blog/monad-pattern-for-functional-programming-in-es6/)

### week5 문제 (솔루션 나와있음, 다시풀어보기?) 

[functions and monad](https://www.codingame.com/playgrounds/2980/practical-introduction-to-functional-programming-with-js/functors-and-monads)