# 복잡성을 줄이는 디자인패턴

## 명령형 에러 처리의 문제점

일반적으로 예외처리를 위해 `try-catch` 문을 쓰곤 하는데, 에러를 낼 가능성이 있는 코드를 try로 감싼다.<br />예외를 던지는 함수는 다음과 같은 특징을 가지고, 함수형 프로그래밍 패턴과 다소 맞지 않다.

- 다른 함수형 코드처럼 합성이나 체이닝이 어렵다.
- 예측 가능하 값을 반환하는 것을 지향하는 참조 투명성과 거리가 멀다.
- 예기치 않게 스택이 풀리면 함수 호출 범위를 벗어나 전체 시스템에 영향을 주는 사이드 이펙트의 가능성이 있다.
- 다양한 에러 조건들을 처리하는 블록들이 중첩되어 사용하기 어렵다.

## 함수형 에러처리

에러의 여지가 있는 코드를 감싼다는 개념은 그대로 가져가되, try-catch 블록은 제거하여 설계해보는 것이 특징이다.

### 불안전한 값은 감싼다.

에러가 발생할 가능성이 있는 불안전한 값을 Wrapper객체로 감싸고, 해당 값에 접근 가능한 연산을 Wrapper에 매핑하는 개념이다.

e.g.) 

```typescript
class Wrapper {
    constructor(value) {
        this._value = value;
    }
    map(f) {
        return f(this._value);
    }
    toString() {
        return `Wrapper ${this._value}`
    }
}

const wrap = (val) => new Wrapper(val);
```



### 함수자 (Functor)

- **Functor는** 사용자가 맵핑 할 수있는 **데이터 타입**.
- 내부의 값에 함수를 적용하는 인터페이스가 있는 **컨테이너**
- functor를 발견하면 *“mappable”* 한 무언가라고 생각하면 된다. 
- functor 타입은 일반적으로 객체처럼 구현되며, 구조를 유지한채 입력에서 출력으로 맵핑하는 `.map()` 메소드를 가진다. 
- 이 때 "구조 유지"란 동일한 유형의 functor를 리턴한다는 것을 의미한다. (컨테이너 내부의 값은 다른 유형 일 수 있음).



# 모나드

![http://tech.kakao.com/files/monad-functor-applicative.png](http://tech.kakao.com/files/monad-functor-applicative.png)

모나드는 타입으로 감싸 빈 값을 자동으로 전파하거나(Maybe 모나드) 또는 비동기 코드를 단순화(Continuation 모나드) 하는 등의 행동을 추가하는 역할을 한다.

- 순서가 있는 연산을 처리하는데 사용하는 **디자인 패턴**
- **Monad Laws 를 만족시키는 구현체**를 뜻한다!
- Monad는 값은 담는 컨테이너의 일종
- Functor을 기반으로 구성되어 있음
- Functor가 Map을 활용했다면 모나드는 FlatMap을 활용

```typescript
interface M<T> { // M은 Monad가 될 타입으로 가정한다.

}

function unit<T>(value: T): M<T> {
    // ...
}

function bind<T, U>(instance: M<T>, transform: (value: T) => M<U>): M<U> {
    // ...
}
```

모나드를 고려하고 있다면 코드의 구조가 다음의 세 가지 조건을 만족해야 한다.

1. **타입 생성자** – 기초 타입을 위한 모나드화된 타입을 생성하는 기능. 예를 들면 기초 타입인 `number`를 위해 `Maybe<number>` 타입을 정의하는 것.
2. **`unit` 함수** – 기초 타입의 값을 감싸 모나드에 넣음. Maybe 모나드가 `number` 타입인 값 `2`를 감싸면 타입 `Maybe<number>`의 값 `Maybe(2)`가 됨.
3. **`bind` 함수** – 모나드 값으로 동작을 연결하는 함수.

## Identity Monad

identity 모나드는 가장 단순한 모나드로 값을 감싼다.

```typescript
function Identity(value) {
  this.value = value;
}

Identity.prototype.bind = function(transform) {
  return transform(this.value);
};

Identity.prototype.toString = function() {
  return 'Identity(' + this.value + ')';
};
```

다음 코드는 덧셈을 Identity 모나드를 활용해 연산하는 예시다.

```typescript
var result = new Identity(5).bind(value =>
                 new Identity(6).bind(value2 =>
                     new Identity(value + value2)));
```



## Maybe 모나드

Maybe 모나드는 Identity 모나드와 유사하게 값을 저장할 수 있지만 어떤 값도 있지 않은 상태를 표현할 수 있다.



## List 모나드

List 모나드는 값의 목록에서 지연된 연산이 가능함을 나타낸다.



## Continuation 모나드

Continuation 모나드는 비동기 일감에서 사용한다. ES6에서는 다행히 직접 구현할 필요가 없다. `Promise` 객체가 이 모나드의 구현이기 때문이다.

1. `Promise.resolve(value)` 값을 감싸고 `pormise`를 반환. (`unit` 함수의 역할)
2. `Promise.prototype.then(onFullfill: value => Promise)` 함수를 인자로 받아 값을 다른 promise로 전달하고 promise를 반환. (`bind` 함수의 역할)

다음 코드에서는 `Unit` 함수로 `Promise.resolve(value)`를 활용했고, `Bind` 함수로 `Promise.prototype.then`을 활용했다.

```typescript
var result = Promise.resolve(5).then(function(value) {
  return Promise.resolve(6).then(function(value2) {
      return value + value2;
  });
});

result.then(function(value) {
    print(value);
});
```

Promise는 기본적인 continuation 모나드에 여러가지 확장을 제공한다. 만약 `then`이 promise 객체가 아닌 간단한 값을 반환하면 이 값을 Promise 처리가 완료된 값과 같이 감싸 모나드 내에서 사용할 수 있다.

두번째 차이점은 에러 전파에 대해 거짓말을 한다는 점이다. Continuation 모나드는 연산 사이에서 하나의 값만 전달할 수 있다. 반면 Promise는 구별되는 두 값을 전달하는데 하나는 성공 값이고 다른 하나는 에러를 위해 사용한다. (Either 모나드와 유사하다.) 에러는 `then` 메소드의 두번째 콜백으로 포착할 수 있으며 또는 이를 위해 제공되는 특별한 메소드 `.catch`를 사용할 수 있다.



### 모나드의 의의

- 값이 없는 상황이나, 값이 미래에 이용 가능해질 상황 등, 일반적으로는 당장 할 수 없는 여러 상황들을 모델링 할 수 있다.
- 비동기 로직을 동기 로직으로 구현하는 것과 동일한 형태로 구현하면서도, 함수의 합성 및 완전한 non-blocking pipeline을 구현할 수 있음.

### 대표적 활용 예시

- 비동기 연산 처리 (Promise)
- Null 예외 처리



### Reference

[https://tpgns.github.io/2018/04/07/functors-and-categories/#fn1](https://tpgns.github.io/2018/04/07/functors-and-categories/#fn1)



### FP 스터디 시 참고될만한 자료들

http://caiorss.github.io/Functional-Programming/ <br />https://github.com/hemanth/functional-programming-jargon <br />