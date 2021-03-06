# 7. 함수형 최적화

- 슬슬 최적화를 얘기해볼 때이다 하하
- 모든 프로그래밍 패러다임은 일장일단을 가질 수 있다.
- "성능이냐 추상화냐" 문제도 마찬가지다. 함수형 프로그래밍은 추상화계층을 제공해서 높은 수준의 유창함과 선언성을 실현한다.
- 하지만 함수형 프로그래밍이 명령형 코드보다 성능이 좋지는 않다.
- 하지만 요즘 컴퓨터는 엄청 빠르고 컴파일러가 발전했기 때문에 그렇게 나쁘지는 않다.
- 함수형 프로그래밍에서는 개별 함수의 평가 속도를 올리지는 못하지만, 정말 그 코드가 필요할 때까지 평가를 지연시키는 전략을 사용한다.
- 순수 함수형 언어는 이것이 자동으로 되지만 자바스크립트에서는 라이브러리 등을 사용해야 한다.

# 7.1 함수 실행의 내부 작동 원리

- 자바스크립트에서는 함수를 호출할 때마다 Context Stack에 레코드(프레임)가 생성된다.
- 스택은 언제나 전역 실행 컨텍스트 프레임에서 출발한다.
- 전역 컨텍스트 프레임은 항상 스택 가장 아래에 위치한다.
- 함수 컨텍스트 프레임은 내부 지역변수 사용하는 만큼 메모리를 사용한다.
  - 지역변수가 없으면 48바이트 정도 되고,
  - boolean, number 등은 8바이트 정도 된다.
- 각 프레임 안에는 `scopeChain` / `variableObject` / `this` 와 같은 정보가 있다
  - 이중 `variableObject`는 함수의 인수와 `arguments` 를 가리키는 속성이다.
- 자바스크립트는 단일 스레드로 실행되며, 동기적 실행 방식이다.
- 전역 컨텍스트는 단 하나만 존재한다.
- 함수 컨텍스트 개수에 제한은 없다.
- 함수를 호출할 때마다 실행 컨텍스트가 새로 생성되고, 재귀호출 할 때도 마찬가지다.

## 7.1.1 커링과 함수 컨텍스트 스택

- 커리는 아주 편리한 기법이지만 추상화를 더한 것이기 때문에 일반적인 함수 실행에 비해 오버헤드가 더 많이 발생할 수 있다.
- 커리된 함수는 함수를 중첩시키는 구조이기 때문에 함수 스택을 더 많이 사용한다.

## 7.1.2 재귀 코드의 문제점

- 함수가 자기 자신을 호출하더라도 새 함수 컨텍스트가 생성된다.
- 그렇지만 기저케이스에 도달 할 수 없다면 Stack overflow가 일어날 수 있다.
- 매우 큰 용량의 데이터를 재귀로 처리하면 배열 크기만큼 스택이 커질 수도 있다.
- 그렇기 때문에 원소가 많은 리스트는 `map`, `filter`, `reduce`등의 고계함수를 이용해 탐색하는 방법이 좋다.
- 커링과 재귀는 메모리를 더 차지하지만 유연성 및 재사용성 측면에서는 더 좋기 때문에 고려해볼만 하다.
- 함수형 프로그래밍은 다른 방식의 최적화를 실현한다.

# 7.2 느긋한 평가로 실행을 늦춤

- 불필요한 함수 호출을 줄이고 꼭 필요한 입력만 넣고 실행하면 성능 향상을 기대할 수 있다.
- 함수형 언어는 기본적으로 모든 표현식이 Lazy Evaluation 된다.
- 하지만 자바스크립트는 기본적으로 모든 함수를 Eager Evaluation한다.
- 즉, 함수 결과값이 필요하지 않더라도 함수 expression을 호출하면 바로 평가가 된다.

## 7.2.1 대체 함수형 조합으로 계산을 회피

- 가장 간단한 방법은 함수를 레퍼런스로 전달하고 조건에 따라 한쪽만 호출하는 것이다.

## 7.2.2 단축 융합을 활용

- Lodash의 chain은 단축 융합이라는 기법을 활용해 함수 실행을 내부적으로 최적화한다.
- 단축 융합이란 몇 개의 함수 실행을 하나로 병합하고 중간 결과를 계산할 때 사용하는 자료구조의 개수를 줄이는 최적화다.
- 이게 가능한 이유는 함수형 프로그램에서 중요시 여기는 참조 투명성 덕분이다.
- 참조 투명성 덕분에 로대시 체인에서 함수는 내부적으로 합성되어 실행된다.

# 7.3 '필요할 때 부르리' 전략

- 반복적인 계산을 피하는 것도 어플리케이션 실행 속도를 끌어올릴 수 있는 방법이다.
- 객체지향 시스템에서는 함수 호출 전에, 캐시나 프록시 계층을 두는 방법으로 반복적인 계산을 피할 수 잇었다.
- `cache`란 비싼 연산을 하기 전에 질의하는 중간 저장소이다.

```javascript
function cachedFn(cache, fn, args) {
  const key = fn.name + JSON.stringify(args);

  if (contains(cache, key)) {
    return get(cache, key);
  } else {
    const result = fn.apply(this, args);

    put(cache, key, result);

    return result;
  }
}
```

- `cachedFn`을 사용하면 함수의 실행과 결과 사이에 중개를 하여 같은 함수를 두번 실행시키지 않는다.
- 하지만 모든 함수에 일일이 이런 래퍼를 두는 건 가독성이 떨어진다.
- 그리고 이렇게 작성한 함수는 캐시 객체에 의존하는 부수효과가 존재한다.

## 7.3.1 메모화(Memoization)

- 메모이제이션도 마찬가지 전략이다. 함수의 인수로 키값을 만들고 실행 결과를 캐시에 보관해두다가 같은 인수로 호출하면 보관된 결과를 즉시 반환한다.
- 이 역시 참조 투명성 덕분에 가능한 일이다.

## 7.3.2 계산량이 많은 함수를 메모화

- 순수 함수형언어는 자동으로 메모이제이션한다. 자바스크립트에서는 수동으로 해야한다.
- 메모이제이션의 덕을 보는 것은 계산이 많은 함수이다.
- `Function.prototype.memoize` 를 통해 모든 함수에 메모이제이션을 적용할 수 있다.
  - 하지만 추천하고 싶지 않음.. 때가 어느땐데 프로토타입;
  - 비슷한 걸로 로대시에 `_.memoize`함수가 있기 때문에 요것을 활용하는 걸 추천한다.

## 7.3.3 커링과 메모화를 활용

- 인수가 많은 함수는 아무리 순수함수라고 해도 캐싱하기가 어렵다.
- 키값 생성이 복잡하기 때문에 오버헤드가 생기기 때문이다.
- 이를 해결하기 위해서 커링을 사용할 수 있다.

```javascript
const safeFindObject = R.curry(function(db, ssn) {
  // IO 검색 수행 (비쌈)
});

const findStudent = safeFindObject(DB("students")).memoize();
```

- 위의 예제에서는 DB는 오직 데이터 접근 용도로만 쓰이므로 가능한 일이다.

## 7.3.4 분해하여 메모화를 극대화

- 함수를 잘게 쪼갤 수록 메모이제이션의 효과는 더 커진다.

## 7.3.5 재귀 호출에도 메모화를 적용

- 재귀 호출에도 메모화는 상당히 큰 도움이 된다.
- 예를들어 Factorial을 재귀호출로 계산한다고 했을때, 101! 을 계산하기 위해서 100! 을 계산하면서 캐싱된 값이 미리 사용될 수 있다.

# 7.4 재귀와 꼬리 호출 최적화

- 재귀 프로그램에 메모이제이션도 도움이 되지 않는 경우가 있다. 입력값이 계속 바뀔 수 밖에 없는 경우에는 그러하다.
- 재귀 호출은 스택 소비량이 훨씬 크기 때문에 일반적인 루프문에 비해 성능이 좋지 않을 수 밖에 없다.
- 하지만 꼬리 재귀 호출(TCO)을 이용하면 이를 최적화 할 수 있다.
- TCO는 ES2015에 추가된 컴파일러 개선항목이다. 재귀 호출을 단일 프레임으로 만들어 실행한다.
- 재귀 호출이 제일 마지막에 일어날 때만 TCO가 일어난다.
- 재귀함수가 가장 마지막에 함수를 호출하면 자바스크립트 런타임은 해당 스택 프레임에서 할 일이 없다고 판단하므로 해당 스택 프레임을 폐기하고, 필요한 상태값을 다음 함수에 전달한다. 이렇게 하면 재귀를 반복하더라도 스택에 계속 프레임이 쌓이지 않는다.

## 7.4.1 비꼬리 호출을 꼬리 호출로 전환

- 다음 함수를 TCO로 최적화해보자

```javascript
function factorial(n) {
  if (n === 1) {
    return 1;
  }

  return n * factorial(n - 1);
}
```

- 이 함수는 TCO의 덕을 입지 못한다. `return` 문이 `n *` 를 포함하므로 `factorial`을 실행 후 할 일이 남아있기 때문이다.
- 이를 최적화 하려면 두 가지 과정을 거쳐야 한다.
  1. 곱셈 부분을 함수의 매개변수로 추가해야 함.
  2. ES2015의 default parameter로 기본 인수 값을 지정한다.
- 꼬리 호출로 최적화 된 함수는 아래와 같은 모양이다.

```javascript
function factorial(n, current = 1) {
  // current는 약간 루프문의 `i`와 비슷한 느낌이다
  if (n === 1) {
    return current;
  }

  return factorial(n - 1, n * current);
}
```

- 꼬리 재귀는 재귀 루프의 성능을 수동 루프에 가깝게 끌어올린다.
- 따라서 자바스크립트처럼 꼬리재귀를 지원하는 언어에서는 변이를 다스리는 훌륭한 대체 수단이다.
- TCO는 ES5에서는 지원하지 않기 때문에 바벨 같은 트랜스파일러를 사용하자.
  - 하지만 어차피 지원안된다면 바벨을 써도 지원이 안될 것 같은데..
  - 그렇다. 해보니까 진짜로 지원이 안된다.
  - 하지만 엄청난 플러그인이 있었다.
  - [https://github.com/krzkaczor/babel-plugin-tailcall-optimization](https://github.com/krzkaczor/babel-plugin-tailcall-optimization)
  - 근데 굳이 쓸 필요가 있을까? IE에서 TCO를 굳이 해야할 이유를 못찾겠다.
- TCO는 우아하고 확장가능한 함수형 프로그래밍과 성능사이의 절충안이다.
- 필자는 성능보다는 유지보수성이 좋은 코드가 좋다고 생각한다.
  - 나 역시 ㅇㅈ
