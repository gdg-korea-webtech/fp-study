# 비동기 이벤트와 데이터를 관리

## 1. 골칫덩이 비동기 코드

비동기 코드를 적절히 개선하지 않으면 다음과 같은 상황에 직면한다.

- 함수 간에 일시적인 의존관계 형성
- 어쩔 수 없이 콜백 피라미드에 빠짐
- 동기/비동기 코드의 호환되지 않는 조합



### 1) 함수 간에 일시적인 의존관계 형성

일시적 결합은 어떤 함수를 논리적으로 묶어 실행할 때 발생.

- 데이터가 도착할 때까지, 또는 다른 함수가 실행될 때 까지 어떤 함수가 기다려야 하는 경우.
- 데이터든 시간이든 어느 쪽에 의지하는 순간부터 부수효과 발생
  - 대표적으로 원격 IO작업이 있다.

```
// 266p 8-1코드 
// 네이티브 XMLHttpRequest를 이용한 getJSON 함수
```



### 2) 콜백 피라미드

- 콜백의 주 용도는 처리 시간이 오래 걸리는 프로세스를 기다리는 도중 UI를 차단하지 않는 것이다.

- 하지만 그렇게 콜백을 사용하다가 데이터를 호출하는 로직이 복잡해지기 시작하면 콜백이 계속해서 엮여 가독성이 떨어진다.

```javascript
// 268p / 8-3 예제
```

코드 8-3은 적절히 분해되지 않은 프로그램의 전형



### 3) 연속체 전달 스타일

- 중첩된 콜백 함수는 읽기도 어렵고 자기 스코프 및 자신이 중첩된 함수의 변수 스코프를 감싼 클로저 만듦

- 불필요한 외부 데이터를 참조하는 레퍼런스를 간직하게 된다.

  - 이러한 코드를 연속체 전달 스타일로 바꾸어 개선이 가능하다.

  ```
  // 270P / 8-4 예제
  ```

  - CPS는 비차단 프로그램의 조각들을 개별 컴포넌트로 분리하기 위한 프로그램 스타일이다.
  - CPS의 강점은 콘텍스트 스택의 효율이 좋다는 것이다. 
  - 다른 함수로 이어지는 과정에서 현재 함수의 콘택스트를 정리하고 새 콘택스트를 만들어 다음 함수를 향하는 방식으로 프로그램의 흐름을 이어간다. => 꼬리에 꼬리를 무는....



## 8-2. 비동기 로직을 Promise로 일급객체로 만듦

보다 함수형 프로그래밍스럽게 코드를 개선해보자.

- 합성과 무인수 프로그래밍을 이용한다.
- 중첩된 구조를 보다 선형적으로 흐르게 눌러 편다.
- 여러 콜백 대신 단일 함수로 에러 처리 로직을 통합하여 코드 흐름을 원활히 한다.

앞서 공부한 바와 같이 Promise는 모나드의 대표적인 예시다. 즉, Promise는 오래 걸리는 계산을 모나드로 감싸는 개념이다.

```javascript
Promise.of(<오래걸리는작업 ㅠㅠ>).map(func1).map(func2); // Promise(결과)
```

Promise는 오래 걸리는 계산이 끝날때까지 '기다렸다가' 미리 매핑한 함수를 실행한다. 모나드에서 반환값이 불확실한 함수를 Maybe, Either모나드로 감쌌듯 Promise도 데이터를 기다리는 개념이다.

### Promise의 상태

상태는 크게

- Pending
- Fulfilled
- rejected
- settled

로 이루어져있다.

```javascript
// promise생성자는 비동기 작업을 감싼 함수를 받는다.

var fetchData = new Promise((resolve, reject) => {
    // 데이터를 비동기로 가져오거나 오래걸리는 계산
    if (success) {
    	resolve(result);    
    } else {
        rejcet(new Error('...'));
    }
});
```



### 메서드 체인

두 가지 이상의 이어지는 비동기 연산 작업을 하고 싶다면 `.then()` 문법을 사용하면 좋다. (p.276)

- 비동기 호출을 중첩하는 대신 .then으로 체이닝하고, 비동기 코드를 Promise monad로 추상화한다.

- 변수를 선언하고 변이를 일으키는 코드는 모두 없애고 람다 함수를 우선한다.

  ```
  // p.279 / 코드 8-6
  ```

- 비동기 호출을 처리하는 세부 로직을 Promise가 대신 처리하므로, 마치 각 함수를 순서대로 하나씩 실행하듯 프로그램을 작성할 수 있다.
- Promise는 비동기 흐름을 숨기지만 시간 관념은 then 으로 분명히 나타낸다.



### Promise.all()

- Promise는 한번에 여러 작업을 동시에 진행할 수도 있다.

  ```javascript
  e.g.)
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, 'foo');
  });
  
  Promise.all([promise1, promise2, promise3]).then(function(values) {
    console.log(values);
  });
  // expected output: Array [3, 42, "foo"]
  ```

- 출력 값은 배열의 원소 순서대로이다.



### 동기/비동기 로직을 합성

- Promise덕분에 동기 프로그램의 모양새를 그대로 유지한 채 여러 함수를 나누어 실행할 수 있다.

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

