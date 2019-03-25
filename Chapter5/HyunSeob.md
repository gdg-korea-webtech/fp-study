# 5. 복잡성을 줄이는 디자인 패턴

- 함수형 프로그래밍은 에러를 깔끔하게 처리할 수 있다.
- `null` `undefined` 체크는 코드를 복잡하게 만들고 시간 낭비다.
- 이를 해결하기 위해 함수자(functor)라는 개념을 활용해 볼 수 있다.

# 5.1 명령형 에러 처리의 문제점

- 에러가 나는 상황은 다양하다.
- 실패 케이스는 대비해야 한다.

## 5.1.1 `try-catch` 에러 처리

- 명령형 언어는 대부분 `try-catch`로 에러를 처리한다.
- 안전하지 않은 걸 `try`로 둘러싸고 발생한 에러를 `catch`로 복원한다.
- 에러처리도 함수형으로 추상화할 필요가 있다.
- `try-catch`를 쓰면 다른 함수와 합성하거나 체이닝을 할 수 없다.

## 5.1.2 함수형 프로그램은 왜 예외를 던지지 않을까?

- 예외를 던지는 방법은 단점이 많고 함수형과도 잘 어울리지 않는다.
- 예외를 던지는 함수의 특징은 다음과 같다.
  - 합성이나 체이닝이 불가능한 함수다.
  - 참조 투명성 원리에 위배된다.
  - 전체 시스템에 영향을 미치는 사이드 이펙트를 일으킨다.
  - 에러를 핸들링하는 코드는 함수를 호출한 부분과 동떨어져있어서 비지역성 원리에 위배된다.
  - 함수의 반환값에 신경을 써야되는데, `catch`에서 에러를 핸들링하는데 시간을 쓰게 된다.
  - 에러 블록이 중첩되면 보기가 안좋다.
- 하지만, 예외를 아예 없애는 건 불가능하다.
- 그리고 예외를 잘 쓰면 효율적인 경우도 물론 있다.
- 하지만 예외를 과용해서는 안된다.

## 5.1.3 `null` 체크라는 고질병

- 함수호출을 실패시키지 말고 `null`을 돌려받으면 그래도 함수를 흘러가게끔 할수는 있다.
- 물론 이렇게 해서 좋은 점은 1도 없다.
- 왜냐면 함수를 호출한 아이가 귀찮게 `null` 체크를 해야하기 때문.

# 5.2 더 나은 방안: 함수자

- 함수형에서 에러처리는 철저히 다른 방식이다.

## 5.2.1 불안전한 값을 감쌈

- 값을 컨테이너로 감싸는 행위는 함수형 프로그래밍의 기본 패턴이다.
- 값을 안전하게 다루고 프로그램의 불변성이 지켜지도록 직접적인 접근을 차단하는 것이다.
- 감싼 값에 접근하는 방법은 연산을 컨테이너에 매핑하는 것이다.
- 배열도 값을 감싼 컨테이너라고 볼 수 있다.
- `map`만이 함수를 매핑할 대상인 것은 아니다.
- 함수는 원래 동일 입력을 동일 결과에 매핑하는 것이다.
- 이렇게 보면 맵은 그냥 관문이라고 볼 수 있다.
- 배열 → 새 배열

```javascript
class Wrapper {
  constructor(value) {
    this._value = value;
  }

  map(f) {
    return f(this._value);
  }
}

const wrap = val => new Wrapper(val);
```

- 에러가 날지 모를 값을 래퍼(Wrapper) 객체로 감싸는 것이 핵심이다.
- 값에 접근하면 안되니, 값을 얻기 위해서는 `identity` 함수를 써야한다.
- 값이 컨테이너에 들어가면 값을 직접 조회하거나 변경할 수 없다.

```javascript
const wrapped = wrap("Get Functional");
wrapped.map(v => v); // 'Get Functional'
```

- 컨테이너를 반환한 값을 리턴하는 함수도 만들 수 있다.

```javascript
fmap(f) {
  return new Wrapper(f(this._value));
}
```

- 이런 함수가 함수자(혹은 함자)다.

## 5.2.2 함수자의 세계로

- 함수자는.. 어쩌구.. 걍 이해는 됐는데 용어가 너무 어렵다.
- 아무튼.. 함수 매핑이 가능한 자료구조다.
- `fmap :: (A → B) → Wrapper(A) → Wrapper(B)`
- `fmap`은 호출할 때마다 컨테이너를 새로 복사후 반환, 불변 연산을 수행한다.
- `fmap`은 타입을 보존하기 때문에 체이닝 패턴을 쓸 수 있다.
- 마치 `Array.map.filter` 를 쓰는 것 처럼..
- 함수자에 중요한 전제조건이 있다.
  - 부수효과가 없어야 한다.
  - 합성이 가능해야 한다.
- 함수자 자체로는 큰 의미가 없다 `null`데이터를 다루지 못하므로
- 모나드로 해결 가능하다.
- 함수자가 건드리는 컨테이너가 바로 모나드다??
- 제이쿼리는 사실 일종의 모나드다/?!?!?! (충격)

# 5.3 모나드를 응용한 함수형 에러 처리

## 5.3.1 모나드: 제어 흐름에서 데이터 흐름으로

- 모나드는 안전하게 에러를 전파한다.
- 모나드는 타입이 있는 언어에서 쓰면 더 좋다. (뇌피셜)
  - 타입스크립트 ㄱㄱ
- 모나드: 모나드 연산을 추상한 인터페이스를 제공한다??
- 모나드형: 모나드 인터페이스를 실제로 구현한 형식.
- 모나드가 준수해야하는 인터페이스
  - 형식 생성자: 모나드형을 생성한다. (생성자)
  - 단위 함수: 모나드를 생성하는 함수 (Factory), 보통 `of`라는 이름을 가진다.
  - 바인드 함수: 연산을 체이닝 한다. `fmap`에 해당, `flatMap`이라고도 한다.
  - 조인 연산: 계층을 편다.

```javascript
class Wrapper {
  constructor(value) {
    // 생성자
    this._value = value;
  }

  static of(a) {
    // 단위 함수
    return new Wrapper(a);
  }

  map(f) {
    // 함수자(바인드함수)
    return Wrapper.of(f(this._value));
  }

  join() {
    // flatten
    if (!(this._value instanceof Wrapper)) {
      return this;
    }

    return this._value.join();
  }
}

Wrapper.of("Hello Monads!")
  .map(v => v.toUpperString())
  .map(v => v);

// map은 중립함수자이다.
// 래퍼가 중첩된 경우 join을 써서 해결한다.
```

- 대체로 모나드는 이것보다 많은 연산을 보유하는게 보통이다.

## 5.3.2 `Maybe`와 `Either`모나드로 에러를 처리

- 모나드는 유효한 값을 감싸지만, 값이 없는 상태도 모형화 가능하다.
- 함수형 프로그래밍에서는 `Maybe`, `Either`를 사용해 에러를 정리한다.

### `null`체크를 `Maybe`로 일원화

- `Maybe`모나드는 `null`체크 로직을 통합하기 위한 목적으로 사용한다.
- `Just(value)`: 존재하는 값을 감싼 컨테이너다.
- `Nothing()`: 값이 없는 컨테이너를 나타낸다.
- `Maybe`는 Nullable 값을 다루는 작업을 추상화하여 개발자가 비즈니스 로직에 전념할 수 있도록 한다.
- `map` 함수는 형식이 `Nothing`이냐 `Just`냐에 따라서 하는 일이 달라진다.

예제에서 나온 코드를 종합해보면, `fromNullable` 로 `null` 체크를 일원화한뒤, 동일한 인터페이스를 가지는 클래스, `Just`, `Nothing`을 적절히 반환하고, 동일한 인터페이스를 지원하여 `null`체크에서 해방되는 성격인듯

예를 들어, `map`에다가 원하는 작업을 매핑하면, `Just`타입인 경우 적절한 동작을 실행하면되고, `Nothing`인 경우 그냥 아무 실행도 하지 않는 것이다.

- `Maybe` 모나드는 좋은 수단이지만, 실패할 경우 이유를 알려주지 않는다.
- `Either` 모나드를 사용해보도록 하자.

### `Either`로 실패를 복구

- `Either`는 절대로 동시해 발생하지 않는 두 값을 논리적으로 구분한 자료구조다.
  - `Left(a)`: 에러 메시지 혹은 예외 객체를 담는다.
  - `Right(b)`: 성공한 값을 담는다.
- `Either` 는 어떤 계산도중 실패할 경우 원인에 대한 정보를 결과와 함께 제공할 목적으로 사용한다.
- 결괏값을 얻을 때는 `getOrElse`를 쓰면 된다.
- `orElse`를 써서 에러가 발생한 상황을 기록할 수 있다.
- 기본적으로 `try` - `catch`를 사용하는 상황에서는 `Either`로 해당 상황을 추상화 할 수 있다.

## 5.3.3 `IO`모나드로 외부 자원과 상호작용

- 자바스크립트는 DOM과 상호작용해야 하므로, 읽기든 쓰기든 모든 작업은 사이드 이펙트를 일으키고 참조 투명성에 위배된다.
- 고로, DOM을 Read하는 것이든 Write하는 것이든 매 실행시마다 결과를 장담할 수 없다.
- 이걸 막을 수는 없지만, 애플리케이션 관점에서 IO 연산이 불변한 것처럼 작동시킬 방법이 있다.

예제, 설명을 종합해보면, `IO`모나드는 기본적으로 "불순한 함수"를 감싼다. 즉, DOM을 읽거나 쓰는, 사이드 이펙트를 감싸서 실행시키지 않고도 전/후에 있을 동작들을 모두 서술한다. 그리고 사이드이펙트를 실행시킴과 동시에 서술된 동작들을 모두 한 번에 실행시킨다.

- `IO` 모나드의 강점은 순수한 부분과 불순한 부분을 가른다는 점이다.

# 5.4 모나드 체인 및 합성

- 모나드는 합성 가능하다.

```javascript
const checkLengthSsn = ssn => {
  return validLength(9, ssn)
    ? Either.right(ssn)
    : Either.left("잘못된 SSN입니다.");
};

const safeFindObject = R.curry((db, id) => {
  const val = find(db, id);
  return val
    ? Either.right(val)
    : Either.left(`ID가 ${id}인 객체를 찾을 수 없습니다.`);
});

const showStudent = ssn => {
  return Maybe.fromNullable(ssn)
    .map(cleanInput)
    .chain(checkLengthSsn) // Chain은 새로 Wrapping을 하지 않는다
    .chain(findStudent)
    .map(R.props(["ssn", "firstname", "lastname"]))
    .map(csv)
    .map(append("#student-info"));
};
```

- 모나드 메서드를 리스코프 치환 원칙에 따라 다형적으로 동작하는 함수로 바꾸어야 한다.
- 그렇게하면 체이닝 패턴이 아닌 함수합성 패턴을 사용할 수 있다.

```javascript
const map = R.curry((f, container => container.map(f));
const chain = R.curry((f, container => container.chain(f));
```

- 이렇게하면 함수 합성 패턴을 사용할 수 있고
- 함수합성 패턴을 사용하면 중간에 추적 로직을 끼워놓을 수 있어 디버깅에도 용이하다.

```javascript
const showStudent = R.compose(
  R.tap(trace('HTML 페이지에 학생 정보 추가')),
  map(append('#student-info)),
  R.tap(trace('학생 정보를 CSV 형식으로 변환')),
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname')),
  R.tap(trace('레코드 조회 성공!')),
  chain(findStudent),
  R.tap(trace('입력 값이 정상입니다')),
  chain(checkLengthSsn),
  lift(cleanInput),
)
```

- 마지막으로 `IO`모나드를 사용해서 DOM을 쓰는 부분을 개선할 수 있다.

# 숙제

[https://stackblitz.com/edit/js-validation](https://stackblitz.com/edit/js-validation)

...이하 코드에서, 모나드 아이디어를 적용해서 각자 최대한 깔끔하게 코드를 개선해봅시다.

Tip) 인풋을 검증하는 용도의 모나드를 만들어봅시다.

Tip2) `IO` 모나드를 이용해봅시다.

# 찾은 것

[https://github.com/carbonfive/functional-programming-weekly-challenge](https://github.com/carbonfive/functional-programming-weekly-challenge)

[https://edabit.com/challenges](https://edabit.com/challenges)

[https://scotch.io/bar-talk/code-challenge-11-javascript-functional-programming#toc-the-challenge](https://scotch.io/bar-talk/code-challenge-11-javascript-functional-programming#toc-the-challenge)
