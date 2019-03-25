# 복잡성을 줄이는 디자인 패턴

## 명령형 에러 처리의 문제점

에러를 try-catch로만 묶어서 처리한다면, 에러를 던지는 시점부터 이후에 아무것도 실행하지 않는다.
체이닝/합성이 불가능하여 좋지 않음.

이런식으로 try-catch 처리를 하게 되면,

- 다른 함수형 프로그래밍 도구 처럼 합성이나 체이닝을 할 수 없다.
- 함수 호출에서 빠져나갈 구실을 마련해주는 것. 단일한, 예측가능한 값을 지향하는 참조 투명성의 원리에 위배됨
- 예기치 않게 스택이 풀리면 함수 호출 범위를 벗어나 전체 시스템에 영향을 미치는 부수효과를 일으킴
- 에러 핸들링 코드가 당초 함수를 호출한 시점과 동떨어져 있어서 비지역성(non-locality) 원리에 위배됨. 에러가 나면 함수는 지역 스택과 환경에서 벗어난다.
- catch 블록 처리에 너무 많은 노력이 들어감
- 에러처리 조건을 계속해서 걸다 보면, catch블록이 중첩되어 불편해짐

오류가 생기는 경우 함수 내에서 null을 반환하면 그나마 undefind나 예상치못한 값을 반환하는 것보다 낫긴 하지만, 호출한 곳에서 null체크를 해줘야 해서 결국 번거로운건 마찬가지이다.

## 더 나은 방안: 함수자

에러 처리를 효과적으로 하기 위해, 에러가 생길 수 있는 불완전한 값을 감싸서 처리한다.
불완전한 값을 컨테이너화 하여 불변성이 유지되도록 하고(직접적인 접근을 차단), 이러한 컨테이너에 연산을 매핑하여 컨테이너 내부 값에 접근할 수 있도록 한다.

```javascript
class Wrapper {
  constructor(value) {
    this._value = value;
  }

  //map :: (A -> B) -> A -> B
  map(f) {
    return f(this._value);
  }

  toString() {
    return 'Wrapper(' + this._value + ')';
  }
}

//wrap :: A -> Wrapper(A)
const wrap = (val) => new Wrapper(val);

const safeSomething = wrap('something');
safeSomething.map(R.identity); // 이렇게 꺼내 써야 한다.
safeSomething.map(console.log);
```

위와 같은 코드에서, R.identity 혹은 console.log를 호출하기 전에, map안에서 예외처리를 해주면 해당 컨테이너에 매핑되는 연산 각자가 에러처리를 하지 않고 map 한군데에서만 에러처리를 해도 된다. 훨씬 깔끔함.

```javascript
//fmap :: (A -> B) -> Wrapper[A] -> Wrapper[B]
fmap(f) {
  return new Wrapper(f(this._value));
}
```

위와 같은 fmap을 사용하면, 컨테이너에 매핑한 연산의 결과값을 동일한 형식의 새로운 컨테이너에 담아 이 새로 만든 컨테이너를 반환한다. 이러한 함수를 **함자(functor)** 라고 한다.

### 함수자의 세계로

함자(functor): 값을 래퍼 안으로 승급한 다음 수저하고 다시 래퍼에 넣을 목적을 염두에 둔 함수매핑이 가능한 자료구조.

다시말하면, 앞에서 예제로 들었던 Wrapper와 값은 자료구조.
그동안 사용했던 Array, Function과 같은 자료구조도 일종의 functor에 해당됨.

```Haskell
fmap :: (A -> B) -> Wrapper(A) -> Wrapper(B)
```

fmap 함수는 함수(A -> B)와 함자(감싼 콘텍스트) Wrapper(A) 를 받아 새로운 함자 Wrapper(B)를 반환한다. 이렇게 반환된 함수자에는 주어진 함수를 값에 적용한 후 다시 Wrapper로 감싼 결과가 담겨있다.

지금까지 사용했던 Array도 함자이고, function도 마찬가지.

*?? compose가 함수자 라고 하는건.. 어떻게 이해해야 하는거지? compose는 함수이지 자료구조는 아니니까...*

```Haskell
map :: (A -> B) -> Array(A) -> Array(B)
filter :: (A -> Boolean) -> Array(A) -> Array(A)

-- function 컨테이너에 연산을 매핑하여 function 컨테이너를 반환한다.
compose :: (B -> C) -> (A -> B) -> (A -> C)
```

**함자의 전제조건**은 다음과 같다.

- 부수효과가 없어야 함
- 합성이 가능해야 함

``` javascript
wrap('getFunctional').fmap(R.identity); // -> Wrapper('getFunctional')
two.fmap(R.compose(plus3, R.tab(infoLogger))).map(R.identity); // -> 5
two.fmap(R.compose(plus3, R.tab(infoLogger), plus3, R.tab(infoLogger))).map(R.identity); // -> 2, 5 의  infoLog가 찍히고, 결과값은 8
```

함수형 프로그래밍에서, 순수/불순을 잘 나누는 것이 '중요'하다. 함자(functor)는 '순수' 부분을 담당함.

함수자는 한 형식의 함수를 다른 형식의 함수로 매핑한다.

모나드는 능률적으로 코드 에러를 처리해서 매끄럽게 함수를 합성할 수 있도록 도와준다.

함수자가 '건드리는' 컨테이너가 '모나드' 이다.

모나드의 주목적은 어떤 자원을 추상하여 그 속에 든 데이터를 안전하게 처리하는 것.(jQuery를 생각하면 편리하다. `$('something').hide()` 를 호출했을 때, something이라는 queryselector로 찾은 값이 없더라도 hide함수를 호출할 때에 Error를 뱉지 않고 조용히 실패(흘려버림)하는 것을 생각해보면 됨)

모나드는 순수/불변 중 '불변'과 '순수'를 이어주는 역할을 하는 듯..?

## 모나드를 응용한 함수형 에러 처리

### 모나드: 제어 흐름에서 데이터 흐름으로
### Maybe와 Either 모나드로 에러를 처리
### IO 모나드로 외부 자원과 상호작용

## 모나드 체인 및 합성

## 마치며

- [초보자를 위한 예제문제](https://paqmind.com/tutorials/functional-programming): 문제-답 형식. 직접 코드를 다운받아서 풀어봐야함. '예제'수준
- [functional javascript workshop](https://github.com/timoxley/functional-javascript-workshop): clone하여 직접 코드를 작성하고 풀어보는 문제. 한국어 있음.
- [RxJS를 이용한 문제풀기](http://reactivex.io/learnrx/): 한단계씩 step by step으로 풀고 넘어가는 듯.
- [HackerRank의 FunctionalProgramming + JS 검색결과](https://www.codewars.com/kata/search/javascript?q=functional+programming&beta=false): 생각보다 많지만 실제로 문제를 풀어보지 않아 조금 애매하다...