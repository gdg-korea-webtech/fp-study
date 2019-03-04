> [오늘의 문제 풀이]
>
> 1. 현섭님 문제, 송희님 문제 - [링크](https://stackblitz.com/edit/fp-study-week-02)

# Chapter 3. 자료구조는 적게, 일은 더 많이

### wrote by. robin

## 3.1 애플리케이션 제어 흐름(control flow)

- `제어 흐름(control flow)` : 프로그램이 답을 도출하기까지 거치는 경로.

### 명령형 vs 선언형

- 명령형 : 작업 수행에 필요한 모든 단계를 노출하여 아주 자세히 서술함. 루프와 분기문, 구문마다 값이 변하는 변수들로 빼곡하다.

```javascript
var loop = optC();

while (loop) {
  var condition = optA();
  if (condition) {
    optB1();
  } else {
    optB2();
  }
  loop = optC();
}
optD();
```

- 선언형 : 독립적인 `블랙박스(black box)` 연산들이 최소한의 제어 구조를 통해 연결되어 추상화 단계가 매우 높다. 함수형 프로그래밍에서는 데이터는 한 연산에서 다른 연산으로 독립적으로(각 연산은 개별적인 순수함수이므로) 흘러가며, 분기와 반복은 상당 부분 줄이거나 컴포넌트 사이의 단순한 연결로 취급한다.

```javascript
// 점으로 연결하려면, 이들 메서드가 모두 포함된 A_OBJECT라는 공유 객체가 있어야 한다.
A_OBJECT.optA()
  .optB()
  .optC()
  .optD();
```

## 3.2 메서드 체이닝

- 여러 메서드를 단일 구문으로 호출하는 OOP 패턴이다.
- 메서드가 모두 동일한 객체에 속해 있으면 `메서드 흘리기(method cascading)`이라고 한다.

```javascript
"Functional Programming".substring(0, 10).toLowerCase() + " is fun";

// 함수형으로 리팩토링
concat(toLowerCase(substring("Functional Programming", 1, 10)), " is fun");
```

## 3.3 함수 체이닝

- FP의 접근 방법 : 자료구조를 새로 만드는 것이 아니라, 배열처럼 흔한 자료구조를 이용해 다수의 크게 나뉜 고계 연산을 적용한다.
  - 작업을 수행하기 위해 무슨 일을 해야하는지 기술된 함수를 인수로 받는다.
  - 임시 변수의 값을 계속 바꾸면서 부수효과를 일으키는 기존 수동 루프를 대체한다. => 관리할 코드가 줄고 에러가 날 만한 코드 역시 줄어든다.

### 3.3.1 람다 표현식

- `람다 표현식(lambda expression)` : `두 줄 화살표 함수(fat-arrow function)`이라고도 함.
- 람다 함수든, 일반 함수든 코드 가독성의 차이만 있을 뿐, 하는 일은 같다.

### 3.3.2 \_.map:데이터를 변환

- 데이터 컬렉션의 원소를 모두 변환할 때
- 항상 새로운 배열을 반환하므로, 불변성을 유지한다.

### 3.3.3 \_.reduce:결과를 수집

- 데이터로부터 어떤 결과를 도출할 때 = 데이터의 원소 배열을 하나의 값으로 짜내는 고계함수로, 원소마다 함수를 실행한 결괏값의 누적치를 계산한다.
  - fn : 배열의 각 원소마다 실행할 이터레이터 함수. (누산치, 현재 값, 인덱스, 배열)
  - accumulator : 계산할 초깃값. 함수가 호출될 때마다 계산된 결괏값을 저장.

### 3.3.4 \_.filter:원하지 않는 원소를 제거

- 데이터 컬렉션에서 계산에서 불필요한 원소를 제거할 때
  - fn : 원소를 결과에 포함할지 결정하는 조건

## 3.4 코드 헤아리기

### 3.4.1 선언적 코드와 느긋한 함수 체인

- FP의 선언적 모델에 따른, 프로그램에 대한 정의 : 개별적인 순수함수들을 평가하는 과정이다.
- 느긋한 함수 체인 - `_.chain` 함수

  - 주어진 입력을 원하는 출력으로 변환하는 연산들을 연결함으로써 입력 객체의 상태를 확장한다.
  - `._(...)` 객체로 단축 표기한 구문과 달리, 이 함수는 임의의 함수를 병시적으로 체이닝 가능한 함수로 만든다.
  - 제일 끝에서 `value()` 함수를 호출하기 전에는 아무것도 실행되지 않는다.

### 3.4.2 유사 SQL 데이터: 데이터로서의 함수

- `map, reduce, filter, groupBy, sortBy, uniq` 등의 함수에 대해서 살펴 봤다. => SQL 구문을 닮아있다.
- Lodash `mixin` : 핵심 라이브러리에 함수를 추가하여 확장한 후, 마치 원래 있던 함수처럼 체이닝할 수 있다.

## 3.5 재귀적 사고 방식

### 3.5.1 재귀란?

- `재귀(recursion)` : 주어진 문제를 자기 반복적인 문제들로 잘게 분해한 다음, 이들을 다시 조합해 원래 문제의 정답을 찾는 기법

```javascript
var factorial = function fac(n) {
  if (n < 2) return 1; // 기저 케이스

  return n * fac(n - 1); // 재귀 케이스
};
```

- `기저 케이스(base case)` : 다른 말로는 `종료 조건(terminationg condition`)이라고도 한다.재귀 함수가 구체적인 결괏값을 바로 계산할 수 있는 입력 집합이다.
- `재귀 케이스(recursive case)` : 함수가 자신을 호출할 때 전달한 입력 집합을 처리한다. 함수가 반복될 수록 입력 집합은 무조건 작아지고(작아지지 않으면 재귀가 무한 반복됨 => 프로그램이 뻗는다.), 가장 마지막에 기저 케이스로 빠지면 하나의 값으로 나온다.

### 3.5.2 재귀적으로 생각하기

- 재귀적 사고 : 자기 자신 또는 그 자신을 변형한 버전을 생각하는 것.

### 3.5.3 재귀적으로 정의한 자료구조

> [오늘의 문제](https://stackblitz.com/edit/fp-study-today)