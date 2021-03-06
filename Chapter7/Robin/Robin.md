> 문제 풀이

# Chapter 7. 함수형 최적화

### wrote by. robin

- 모든 프로그래밍 패러다임이 100% 완벽할 수는 없고, 장.단점이 있다.
- 함수형 프로그래밍은 추상화 계층을 제공해서 높은 수준의 유창함(`fluency`)과 선언성(`declarativeness`)을 실현한다.
- **Q. 과연, 함수형 코드가 명령형 코드만큼의 성능이 나올까?**

  - **A. 함수형 프로그래밍은 개별 함수의 평가 속도를 올리기보다는 주로 함수 중복 호출을 피해서 코드가 정말 필요할 때까지 평가를 지연시키기 때문에, 애플리케이션이 전체적으로 빨라진다.**

## 7.1 함수 실행의 내부 작동 원리

- 자바스크립트(이하 "JS")에서는 함수를 호출할 때마다 함수 콘텍스트 스택(`context stack`)에 레코드(프레임 `frame`)가 생성된다.

  > - 스택이란?
  >
  >   Last In, First Out 방식으로 삽입/삭제되는 객체를 보관하는 자료구조이다. 스택의 모든 여녀산은 항상 맨 위에 쌓인 데이터를 대상으로 한다.
  >
  > - 콘텍스트 스택이란?
  >
  >   함수 실행 및 함수가 에워싼(`close over`) 변수를 관리하는 JS 프로그래밍 모델이다. 전역 데이터가 담긴, 전역 실행 콘텍스트 프레임에서 출발한다.
  >
  > - 함수의 스코프 체인 vs JS 객체의 프로토타입 체인
  >
  >   둘의 동작 방식은 비슷하지만, 후자는 프로토타입 속성을 통해 객체를 상속할 수 있는 연결 고리이다. 스코프 체인은 내부 함수가 자신을 둘러싼 외부 함수의 클로저에 접근할 때 사용하는 연결 고리이다.
  >
  > 참고자료 :
  > [자바스크립트 동작원리: 엔진, 런타임, 호출 스택](https://joshua1988.github.io/web-development/translation/javascript/how-js-works-inside-engine/)

  - 함수형 프로그래밍에서 유연성과 재사용성을 늘리기 위해, 함수를 분해하고 커리하는 것은 좋지만, 커리된 함수의 지나친 사용은 콘텍스트 스택에 영향을 미치게 되므로 주의해야 한다.

### 커링과 함수 콘텍스트 스택

- JS에서 커리된 함수를 호출하면 벌어지는 일

  > 어떤 함수를 커리하면, 한번에 인수를 전부 넣고 평가하는 체제에서 한 번에 인수를 하나씩 받는 호출을 여러 번 하는 체제로 전환된다. (4장)

  - (예시)

    ```javascript
    const logger = function(appender, layout, name, level, message)

    //커리를 적용하면 다음과 같이 중첩된 구조로 바뀐다.
    const logger =
      function (appender){
        function (layout){
          function (name){
            function (level){
              function (message){
                ...
      }
    ```

    - 중첩 구조는 함수 스택을 더 많이 쓴다.
    - 심지어, 자바스크립트는 동기 실행되기 때문에 우선 전역 콘텍스트 실행을 멈추고, 새 활성 콘텍스트를 만든 다음, 변수 해석에 사용할 전역 콘텍스트 레퍼런스를 생성한다.

  - 커리된 함수를 돌리면 브라우저가 먹통이 된다. => (남발하지 말라는 뜻인 것 같은데, 기준선을 제시해 주었으면... 좋을 것 같다.)

### 재귀 코드의 문제점

- 새 함수 콘텍스트는 함수가 자신을 호출할 때에도 만들어진다.
- 기저 케이스에 도달할 수 없으면 => 끝나지 않으니까 => 스택 오버플로우가 일어날 수 있다.
- 특히, 원소가 많은 리스트는 고계함수(`map, filter, reduce` 등)를 사용해서 조회하는 게 좋다. => 함수 호출을 중첩하지 않고 반복할 때마다 스택을 재활용 할 수 있기 때문이다.

## 7.2 느긋한 평가로 실행을 늦춤

- 애플리케이션 성능 향상 : 불필요한 함수 호출을 삼가고 꼭 필요한 입력만 넣고 실행한다.
- 느긋한 평가는 여러 가지가 있고, 언어마다 다를 수 있지만 근본적으로 의존하는 표현식이 호출될 때까지 가능한 오래 미룬다는 원리는 같다.
- JS는 기본적으로 조급한 평가(`eager evaluation`)이다. => 함수 결과값에 대해 따져볼 새도 없이 변수에 바인딩되자마자 표현식 평가를 마친다. - 탐욕스러운 평가(`greedy evaluation`)라고도 한다.

### 느긋한 평가 활용법 1) 불필요한 계산 피하기

> (예시) 함수를 레퍼런스(또는 이름)로 전달하고 조건에 따라 한쪽만 호출하여 쓸데없는 계산을 건너뛰는 것이다.
>
> ```javascript
> const alt = R.curry((func1, func2, val) => func1(val) || func2(val));
> const showStudent = R.compose(
>   append("#student-info"),
>   alt(findStudent, createNewStudent)
> );
> showStudent("444-44-4444");
> var studnet = findStudent("444-44-4444");
> // 다음 명령형 코드와 똑같이 작동함
> if (student !== null) {
>   append("#student-info", student);
> } else {
>   append("#student-info", createNewStudent("444-44-4444"));
> }
> ```

### 느긋한 평가 활용법 2) 함수형 라이브러리에서 단축 융합(`shortcut fusion`) 사용하기

- 실행 전에 전체 프로그램을 미리 정의해서 함수형 라이브러리가 최적화를 수행하게 하는 것 - 단축 융합

> (예시) 로대시에서 `value()`는 전체 함수를 모두 실행한다. 서술부와 실행부를 나눌 수 있고, 함수 실행 중 차지하는 공간을 로대시가 알아서 관리해서 최적화할 수 있다.

- 단축 융합이란? 몇 개 함수의 실행을 하나로 병합하고 중간 결과를 계산할 때 사용하는 내부 자료구조의 개수를 줄이는 함수수 수준의 최적화이다. => 자료구조가 줄면 대량 데이터를 처리할 때 드는 비용을(예를 들면, 과도한 메모리 사용) 줄일 수 있다.

## 7.3 '필요할 때 부르리' 전략

- 애플리케이션 실행 속도를 올리는 방법 중 하나는, 반복적인 계산을 피하는 것이다.
- 캐시(`cache`)란 값비싼 연산을 하기 전에 먼저 검토하는 중간 저장소 겸 메모리이다.
  - 함수 실행 결과를 식별하기 위해 함수명과 인수를 조합하여 키값을 정한다.
  - 주어진 키값으로 이전에 함수가 실행된 적이 있는지 캐시를 뒤진다.
    - 캐시에 값이 있으면? => 캐시 히트! : 캐시에 있는 값을 바로 반환한다.
    - 캐시에 값이 없으면? => 캐시 미스! : 함수를 바로 실행한다.
- 모든 함수에 일일이 이렇게 작성하면 가독성도 떨어지고 피곤하다. 결정적으로 전역 공유 캐시 객체에 의존하는 **부수효과**가 있다.
- 해결책으로 메모화(`memoization`)라는 매커니즘이 있다.

### 7.3.1 메모화(`memoization`)

- 전역 공유 캐시 객체에 의존하는 **부수효과**가 있다. => 참조 투명성을 위해 단순 함수 호출에 메모화를 적용하면 어떤 효과가 있을까?

### 7.3.2 계산량이 많은 함수를 메모화

- 순수 함수형 언어와는 다르게(자동으로 메모화), JS나 Python 같은 언어에서는 함수를 언제 메모할지 선택할 수 있다.
- 참조 투명하다 : 동일한 문자열을 입력하면 반드시 동일한 문자열이 출력된다.
- 두가지 적용 방법
  - 함수 객체의 메서드를 호출한다.
  - 함수 정의부를 감싼다.
- 메모화를 하면 동일한 입력으로 함수를 재호출할 때, 내부 캐시가 히트되어 즉시 결과가 반환된다.

### 7.3.3 커링과 메모화를 활용

- 여러 인수를 받는 함수의 메모화 과정에는 적합한 캐시키를 생성하는 작업이 복잡하고 비싼 연산을 수반한다. => 커링을 쓴다.
- 인수가 여러 개인 함수는 아무리 순수함수라도 캐시하기가 어려운 이유
  - 캐시 계층에서 추가 오버헤드가 안 생기게 하려면 키값 생성 연산이 단순해야 하는데, 인수가 여러 개일 경우에는 더 복잡해질 수 밖에 없다.

### 7.3.4 분해하여 메모화를 극대화

- 코드를 잘게 나눌수록 메모화 효과는 커진다. : 어떤 함수라도 내부에 캐시 장치를 달면 프로그램을 빠르게 평가한다.
- 프로그램을 자신과 닮은, 메모화 가능한, 작은 하위 작업으로 쪼개는 재귀 역시 분해의 한 종류이다.

### 7.3.5 재귀 호출에도 메모화를 적용

- 재귀 때문에 스택이 비정상적으로 커질 때, 예외가 발생하거나 브라우저가 뻗는 경우가 있다.
- 메모화를 이용하면 도움이 되는 이유
  - 일반적으로 재귀 호출은 기저 케이스에 도달할 때까지, 큰 문제의 하위 문제들을 풀어 마지막에 최종 결과를 낸다.
  - 하위 문제의 결과를 캐시하면 같은 함수를 호출할 때 성능을 끌어올릴 수 있다.

## 7.4 재귀와 꼬리 호출 최적화

- 메모화가 도움이 되지 않는 경우 : 함수 입력이 계속 바뀔 수 밖에 없어서, 내부 캐시 계층을 사용할 수 없을 떄.
- 재귀를 일반 루프만큼 실행을 최적화하는 방법 : 컴파일러가 꼬리 재귀 호출(`tail call optimization`)을 수행하도록 재귀 알고리즘을 짜면 된다.
- 예시

  ```javascript
  const factorial = (n, current = 1) =>
    n === 1 ? current : factorial(n - 1, n * current);
  ```

- 최적인 이유 : 재귀 함수가 가장 마지막에 함수를 호출하면, 자바스트립트 런타임은 남은 할 일이 없기 때문에 더 이상 현재 스택 프레임을 붙잡고 있을 이유가 없다. => 폐기함
- 함수 콘텍스트에서 필요한 상태 값은 대부분 인수 형태로 다음 함수에 넘기면 된다.
- 재귀를 반복할 때마다 스택에 새 프레임이 계속 쌓이지 않고, 이전에 쓰고 버린 프레임을 재활용할 수 있다.
- 피라미드 모양새로 쌓이던 재귀 실행이, 평평한 콘텍스트 스택 구조로 단순해진다.

### 비꼬리 호출을 꼬리 호출로 전환

- (예시) 1

  - 초기 버전의 재귀함수

  ```javascript
  const factorial = n => (n === 1 ? 1 : n * factorial(n - 1));
  ```

  - 재귀 단계 n \* factorial(n - 1) 값과 숫자 n을 곱한 결과를 마지막에 반환하므로 꼬리 호출이 아니다.
  - 전환 방법

    1. 곱셈 부분을 함수의 매개변수로 추가해서 현재 곱셈을 추적(축적?)한다.
    2. 기본 매개변수로 기본 인수 값을 미리 정한다.

  - 전환 결과

  ```javascript
  const factorial = (n, current = 1) =>
    n === 1 ? current : factorial(n - 1, n * current);
  ```

- (예시) 2

  - 초기 버전의 재귀함수

  ```javascript
  function sum(arr) {
    if (_.isEmprty(arr)) {
      return 0;
    }
    return _.first(arr) + sum(_.reset(arr));
  }
  ```

  - 함수가 마지막으로 호출되기 때문에, _.first(arr) + sum(_.reset(arr))은 꼬리 호출이 아니다.
  - 전환 방법 요약 : 후속 호출과 공유할 데이터는 함수 인수의 일부로 추가한다.

  - 전환 결과

  ```javascript
  function sum(arr, acc = 0) {
    if (_.isEmprty(arr)) {
      return acc;
    }
    return sum(_.reset(arr), acc + _.first(arr));
  }
  ```

> 오늘의 문제
>
> 1.  피보나치를 재귀 함수로 짜시오.
> 2.  꼬리 호출 최적화를 하시오.
> 3.  메모화 하시오.
