# 4. 재사용 가능한, 모듈적인 코드로

- 모듈성: 프로그램을 더 작고, 독립적인 부분으로 나눌 수 있는 정도.
- 개발자의 생산성, 유지보수성, 가독성에 도움이 된다.
- 프로그래밍 세계에서는 문제를 더 작은 조각으로 쪼개고, 이것들을 재구성하는 방식이 좋다.

# 4.1 메서드 체인 대 함수 파이프라인

- 메서드 체인은 3장에서 이미 살펴본 방식, `.`을 통해 함수들을 연결하는 것
- 파이프라이닝으로도 함수를 연결할 수 있다.

**하스켈의 함수 표기법**

```
<function-name> :: <Inputs*> -> <Output>
// 예)
isEmpty :: String -> Boolean
```

- 함수는 타입(형식)간의 매핑이다.
- 메서드 체이닝: 단단한 결합, 제한된 표현성
- 파이프라인 배열: 느슨한 결합, 유연함

## 4.1.1 메서드를 여럿 체이닝

**메서드 체이닝의 단점**

```javascript
_.chain(names)
  .filter(isValid)
  .map(s => s.replace(/_/, " "))
  .uniq()
  .map(_.startCase)
  .sort()
  .value();
```

위 코드는 구조적으로 괜찮고, 가독성도 좋아졌지만, 로대시 객체에 매여있다는 단점이 있다. 게다가 로대시가 제공하는 연산만 사용가능하므로, 다른 함수를 연결하기 쉽지 않다.

## 4.1.2 함수를 파이프라인에 연결

- 파이프라인이란: 한 함수의 출력이 다음 함수의 입력이 되게끔 느슨하게 배열한, 방향성 함수 순차열
- 메서드 체이닝은 객체 메서드를 통해 함수들을 단단히 결합,
- 파이프라인은 함수 입출력을 연결지어 느슨하게 결합
- 하지만, 함수의 항수(인수 갯수) 및 타입은 호환 가능해야 함.
- 타입 호환 체크를 위해선 **타입스크립트가 조음** ㅎ

# 4.2 함수 호환 요건

파이프라인을 사용하기 위해서 두 가지 요건이 충족되어야 한다.

- 타입: 앞 단계 함수의 리턴 타입 및 수신 함수의 인수 타입의 일치
- 항수: 인수의 갯수의 일치
- 그러니까 제발 타입스크립트 씁시다 ;

## 4.2.1 형식이 호환되는 함수

- 함수호환요건.. 벌써 세번째 반복한다 ㅇㅅ끼야
- 타입은 정적 타입 언어에서는 체크되지만 자바스크립트에서는 체크가 안된다
- 그러니까 **타입스크립트**를 쓰자
- 덕 타이핑: 어떤 객체가 실제로 어떤 타입처럼 동작한다면 그냥 그 타입인 것이다.
- 아니 이런 좋은 문서가?

[TypeScript: 인터페이스(Interface)](https://hyunseob.github.io/2016/10/17/typescript-interface/#%EB%8D%95-%ED%83%80%EC%9D%B4%ED%95%91-Duck-typing)

- 함수 `f` 와 `g` 가 있을 때, `f`의 출력 타입과 `g`의 입력 타입이 동등하다면 두 함수는 호환된다고 할 수 있다.

## 4.2.2 함수와 향수: 튜플

- 향수: Arity, 함수가 받은 인수의 갯수
- FP에서는 함수에 선언된 인수의 갯수가 참조 투명성의 결과다
- → 해석하자면, 함수 외부에서 오는 값은 참조할 수 없기 때문에(참조 투명성) 함수 내부에서 참조하는 값은 모조리 인수로 들어와야 되는 것이 맞고, 이로인해 인수의 갯수가 바뀌게 될 것이다.
- 또한, 인수의 갯수는 함수의 복잡도와 비례한다. 즉, 인수의 갯수가 늘면, 복잡도도 비례해 증가한다.
- 인수의 갯수는 가능한 적은 것이 낫다.

---

- 함수형 프로그래밍에서는 두 가지 이상의 값을 반환하기 위해 튜플이라는 자료구조를 사용한다.
- 튜플: 유한 원소를 가진 정렬된 리스트
- 객체 리터럴을 이용해 여러값을 반환하는 방법도 가능하다. 하지만 튜플이 더 좋은 이유는 아래와 같다.
  - 불변성: 한 번 만들어지면 내용을 못바꾼다.
  - 임의 형식의 생성 방지: 무관한 값을 연관짓는데 튜플만한게 없다. 하하. 괜히 객체쓰면 타입 정의하고 더 복잡하다.
  - 이형 배열 생성 방지: 타입이 다른 원소가 배열에 섞여 있으면 복잡해진다. 하지만 튜플은 방지가 된다.
- 그러나 자바스크립트는 튜플을 지원하지 않는다. (???)
- 구러니깐 알아서 구현해라 (???)
- 아 참고로 **타입스크립트**는 **튜플 자료형을 지원**하고 있습니다 ^^;
- 그러니까 구현하지 말고 타입스크립트를 쓰시면 모든게 해결~ ^^..!!
- (사족) 개인적으로 구현까지 해서 쓸 것 있나 싶음.. 코드보면 구현부터 해서 사용법도 졸라 복잡해보이는데 걍 타입스크립트 씁시다.. TS 안써도 난 충분하다고 생각함..

# 4.3 커리된 함수를 평가

- 여러개의 인수를 가진 함수를 실행하는 것은 불편하다.
- 자바스크립트에서는 함수를 호출할 때 인수를 적게 넣어도 함수가 실행이 된다.
- 커리된 함수는, 인수를 부족하게 넣었을때 나머지 인수를 "기다리는" 함수이다.
- 자바스크립트 함수는 커링이 자동으로 되지 않는다.
- 로대시 혹은 람다에서 커리된 함수를 만들기 위한 함수를 제공한다.

```javascript
function hello(a, b) {
  console.log(a, b);
}

const curriedHello = \_.curry(hello);
curriedHello(1, 2); // 콘솔에 1, 2 출력
curriedHello(1)(2); // 콘솔에 1, 2 출력

const hello1 = curriedHello(1);
hello(2); // 콘솔에 1, 2 출력
```

## 4.3.1 함수 팩토리를 모방

```javascript
public interface StudentStore {
  Student findStore(String ssn);
}

public class DbStudentStore implements StudentStore {
  public Student findStudent(String ssn) {
    // DB에서 Student를 조회후 리턴
  }
}

public class CacheStudentStore implements StudentStore {
  public Student findStudent(String ssn) {
    // Cache에서 Student를 찾고 리턴
  }
}

StudentStore store = getStudentStore();
store.findStudent('444-44-444'); // 어디서 학생 정보를 가져오는지는 호출 부에서 알바 아님.
```

커링을 쓰면 이 패턴을 모방할 수 있다.

```javascript
const fetchStudentFromDb = R.curry(function(db, ssn) {
  // DB에서 Student 조회후 리턴
});

const fetchStudentFromArray = R.curry(function(arr, ssn) {
  // arr에서 Student 찾고 리턴
});

const findStudnet = useDb ? fetchStudentFromDb(db) : fetchStudentFromArray(arr);
findStudent("444-44-4444");
```

개인적으로는 이게 좋은 패턴인지 모르겠다.

객체지향 상속에서는 일단 분기자체가 필요없고, (`useDb`) 만약 정보의 출처가 훨씬 많아도 대응 가능한데, 함수형에서는 그게 안됨.

## 4.3.2 재사용 가능한 함수 템플릿 구현

**log4js의 사용예제**

```javascript
const logger = new Log4js.getLogger("StudentEvents");
logger.info("학생이 정상적으로 추가되었습니다!");

// Appender 인터페이스를 추가하면 로그를 Alert 형태로 볼 수 있음
logger.addAppender(new Log4js.JSAlertAppender());

// Layout Provider를 세팅하면 출력 포맷을 변경할 수 있음
appender.setLayout(new Log4js.JSONLayout());
```

로거를 쓸때마다 `addAppender` 나 `setLayout`등을 매번 호출 해주는 게 불편할 것 같다. 이를 함수 템플릿으로 만들어 해결할 수 있다.

```javascript
const log = function(appender, layout, name, level, message) {
  const appenders = {
    alert: new Log4js.JSAlertAppender(),
    console: new Log4js.BrowserConsoleAppender(),
  }
  const layouts = {
    basic: new Log4js.BasicLayout(),
    json: new Log4js.JSONLayout(),
    xml: new Log4js.XMLLayout(),
  }

  const logger = new Log4js.getLogger(name)
  logger.addAppender(
    appenders[appender].setLayout(layouts[layout)
  )
  logger.log(level, message, null)
}

const curriedLog = R.curry(log)
const jsonAlert = curriedLog('alert', 'json', 'FJS')
jsonAlert('ERROR', '에러가 발생했습니다!')

const logError = curriedLog('console', 'basic', 'FJS', 'ERROR')
logError('404 에러가 발생했습니다!')
```

함수 인수가 모두 전달되기 전까지는 실행을 하지 않고, 지금까지 넘긴 인수를 모두 기억하는 상태의 새로운 함수가 만들어지는 것이라고 보면 된다.

클로저를 여러번 쓰는 것과 비슷하지만, 다른 점은 함수를 실행하는 선택지가 두가지라는 것이다, 한번에 함수인수를 다 넘겨도 실행이 되니까.

**커링에 대한(까는) 좋은 글**

[Currying is not idiomatic in JavaScript](http://2ality.com/2017/11/currying-in-js.html)

# 4.4 부분 적용과 매개변수 바인딩

- 부분 적용(Partial Application): 일부 함수의 매개변수 값을 고정시켜 더 인수가 적은 함수를 만든다.
- 커링과 부분적용, 헷갈린다.
- 커리된 함수는 자동으로 모든 인수가 하나씩 쪼개져 부분적용된 함수라고 보면 된다.

```javascript
function hello(a, b, c) {
  console.log(a, b, c);
}

const curriedHello = _.curry(hello)(1);
const partialHello = _.partial(hello, 1);

curriedHello(2, 3); // 바로 실행
curriedHello(2); // 실행 안됨
curriedHello(2)(3); // 바로 실행

partialHello(2, 3); // 바로 실행
partialHello(2); // 실행되나, 마지막 `c`가 undefined로 출력됨
partialHello(2)(3); // 에러 발생

// 그리고 파셜은 인수 순서에 상관없이 사용가능함.
// _가 a, b위치로 가면 해당 부분을 나중에 받음
const partialHelloC = _.partial(hello, _, _, 3);

partialHelloC(1, 2); // 1, 2, 3 출력
partialHelloC(1); // 1, undefined, 3 출력
```

## 4.4.1 언어의 핵심을 확장

- 부분 적용은 프로토타입을 확장할 때 사용할 수 있다.
- 그러나 이것은 안티패턴이다. 차후 자바스크립트가 확장될 때 충돌할 가능성 있음.

```javascript
String.prototype.first = _.partial(String.prototype.substring, 0, _);
// 근데 이렇게 하면 안되나?
String.prototype.first = function(length) {
  return this.substring(0, length);
}; // 진심 이게 더 낫지 않음??
// 그만 알아보자
```

## 4.4.2 지연된 함수에 바인딩

```javascript
const Scheduler = (function() {
  const delayedFn = _.bind(setTimeout, undefined, _, _);

  return {
    delay5: _.partial(delayedFn, _, 5000), // ??
    delay5: setTimeout(delayedFn, 5000) // 심지어 이게 더 짧고 편함;
    // ...
  };
})();

Scheduler.delay5(() => {
  // 아니 진심 이게 편한가요?
  console.log("5초 후에 밝혀집니다.");
});
```

개인적으로는 예제가 좀 구리게 나와서 별로 쓸모 없게 보임. 실제로도 Partial은 함수를 새로 만드는 것으로 아주 쉽게 대체 가능.

# 4.5 함수 파이프라인을 합성

- 합성을 하기 위해서는 사이드 이펙트가 없다는 것이 보장되어야 한다.
- 순수 함수로 작성된 프로그램은 그 자체로 순수하기 때문에 다른 시스템에 일부로 넣기 쉽다.

## 4.5.1 HTML 위젯에서 합성하기

- 작은 컴포넌트를 조합해 조금 큰 컴포넌트를 만들고 그 컴포넌트를 합성해 더 큰 컴포넌트를 만들 수 있다.
- 튜플의 두번째 항으로 다시 튜플을 넣어주면 무한개의 아이템을 받을 수 있는 배열을 만들 수 있다.

```javascript
const Node = Tuple(Object, Tuple);
const element = R.curry((val, tuple) => new Node(val, tuple));

element(1, element(2, element(3, element(4, null))));
```

- 하스켈 같은 언어는 위와 같은 식으로 리스트를 생성한다.
- 아마도 Lazy Sequence인 것 같다.
- 그래서 어쩌란..?

## 4.5.2 함수 합성: 서술과 평가를 구분

```javascript
const str = `어쩌구 저쩌구 그렇구 저렇구 이렇구 재밌구 잼없구 그렇다고`;

const explode = sentence => sentence.split(/\s+/);
const count = arr => arr.length;

const countWords = R.compose(
  count,
  explode
);

countWords(str);
```

- 읽기 편하고 의미 잘 와닿는다.
- `countWords`를 실행하기 전에는 아무 평가도 일어나지 않는다.
- 함수의 서술부와 평가부가 분리되어 있다.
- 참조 투명한 함수는 한 객체를 다른 객체에 연결하는 화살표와도 같다.
- 제발 prototype 확장좀 그만해

## 4.5.3 함수형 라이브러리로 합성

우리 이미 이거 한 것 같아서 패스 (절대 귀찮아서 그런게 아님)

## 4.5.4 순수/불순 함수 다루기

- 불순한 코드는 실행하면 사이드 이펙트가 드러나고 외부 의존성이 있어서 바깥의 데이터에 접근해야 한다.
- 모든 함수를 순수하게 만들 수는없다.
- 순수/불순함수가 어느 정도 섞여있음을 받아들여라.
- 대신 순수/불순 함수를 구분하고 불순함수를 격리하면 좋다.

---

- 합성 시 `compose`대신 `pipe`를 쓰면 좀 더 자연스러워 보인다. (왼쪽 → 오른쪽)
- F#에 파이프 포워드 연산을 지원하는데 자바스크립트는 없다.
- 하지만 자바스크립트에도 파이프라인 연산자가 추가될 예정이다 ㅎㅎ (현재 stage 1)

[파이프 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Pipeline_operator)

## 4.5.5 무인수 프로그래밍

- `compose`등의 함수를 사용할 때는 인수를 전혀 사용하지 않게 된다.
- 이것을 무인수(point-free) 코드라고 한다.
- 이런 스타일로 코딩하는 걸 암묵적 프로그래밍(tacit programming)이라고 한다.
- 이런 프로그래밍 스타일에서는 함수들이 어떤 인수를 받는지, 어떻게 연결되는지는 선언되지 않는다.
- 보기 좋지만, 에러처리나 디버깅이 어려울 수 있다.

# 4.6 함수 조합기로 제어 흐름을 관리

- `if`, `else`, `for` 같은 것을 함수형에서는 쓰지 않는다.
- 따라서 그것을 대체할 수단이 필요할 것이다. 그것이 함수 조합기다.
- 함수 조합기는 다른 함수나 조합기를 조합해서 제어 로직처럼 작동시키는 것이다.

## 4.6.1 항등 (I-조합기)

- identity :: (a) → a
- 주로 함수의 수학적 속성을 알아보는데 쓰인다.
- 뭔가 몇가지 사례를 설명하긴 하는데 다음에 알아보자는 식이다,

## 4.6.2 탭 (K-조합기)

- tab :: ( a → \* ) → a → a
- 주로 파이프라인에 디버그 목적의 함수를 끼워넣는데 사용
- 같은 값을 받아 같은 값을 반환하므로 앞 뒤 함수에는 영향을 미치지 않는다.

## 4.6.3 선택 (OR-조합기)

- 두개의 함수를 입력받고, 첫번째 함수 실행후 결과가 falsy한 값이면 두번째 함수 실행한 값을 리턴
- 첫번째 함수 실행후 truthy한 값이면 그대로 리턴

## 4.6.4 순차열 (S-조합기)

- 같은 인수를 받는 함수 여러개를 순차적으로 실행시킨다.

## 4.6.5 포크(조인) 조합기

```javascript
function fork(join, func1, func2) {
  return function(val) {
    return join(func1(val), func2(val));
  };
}
```

# 이번주 문제

[https://www.codewars.com/kata/stringing-me-along/train/javascript](https://www.codewars.com/kata/stringing-me-along/train/javascript)
