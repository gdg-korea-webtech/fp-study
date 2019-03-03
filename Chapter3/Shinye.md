# 자료구조는 적게, 일은 더 많이

## 1. 애플리케이션의 제어 흐름

- 프로그램이 정답에 이르기까지 거치는 경로를 **제어흐름** 이라고 한다.
  - 함수형 프로그램의 경우 최소한의 제어 구조를 통해 연결되어 추상화 수준이 높다. 
  - 이처럼 연산을 체이닝하면 간결하고 직관적으로 프로그램을 작성할 수 있어 제어 흐름과 계산 로직을 분리할 수 있고, 코드와 데이터를 더욱 효과적으로 작성할 수 있다.



## 2. 메서드 체이닝 & 함수 체이닝

- 여러 메소드들을 **단일 구문**으로 호출하는 방식. 대표적으로 JS로 DOM을 조작할 때 쓴다.

  ```javascript
  document.getElementByTagName('body')[0].appendChild(newnode);  
  ```



## 3. 람다 표현식

- 함수를 마치 값 처럼 쓸 수 있도록 도와준다.

  ```javascript
  const name_a = (p) => p.fullname; // return 을 안써도 표현식을 계산한 값이 곧 반환값임.
  const name_b = (p) => { // 여러 줄로 표현: 일반 함수 본체와 똑같이 실행됨 (값 반환 X)
      const modified = p.fullname + ' Female';
      return modified;
  }
  ```



## 4. Lodash

### 1) _.map()

- 각 원소에 iterator 함수를 적용하여 크기가 같은 새 배열을 반환하는 것. 항상 새로운 배열을 반환하기 때문에 불변성을 유지할 수 있다.

### 2) _.reduce()

- 배열의 원소를 하나의 값으로 도출해내는 함수. 원소마다 iterator를 실행한 결괏값의 누적치를 계산한다.

  ```javascript
  const array1 = [1, 2, 3, 4];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  
  // 1 + 2 + 3 + 4
  console.log(array1.reduce(reducer));
  // expected output: 10
  ```

### 3) _.filter

-  메서드는 주어진 판별 함수를 통과하는 요소를 모아 새로운 배열로 만들어 반환한다.

  ```javascript
  const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
  const result = words.filter(word => word.length > 6);
  console.log(result);
  // output: Array ["exuberant", "destruction", "present"]
  ```

### 4) 그 외

- 위의 함수들은 주어진 배열을 모두 순회하기 때문에 도중에 그만둘 수 없다.
- 때문에 함수를 적절하게 쓰지 않으면 일부 상황에선 비효율적일 수 있다.
- 따라서 대안으로 `_.some` 등과 같은 함수가 있다. ( `_.some` 의 경우 원하는 조건 중 하나라도 충족하면 순회를 종료한다.)



## 코드 헤아리기

- 코드를 볼 때 해당 코드가 어떤 역할을 하는지에 대해 이해가 용이하다는 의미로 쓰인다.

  

  ### 선언적 코드와 느긋한 함수 체인

  - FP는 개별적인 순수함수 조합들의 연산이라고 볼 수 있다.
  - 코드의 흐름성과 표현성을 높이기 위한 추상화 수단
  - 개발하려는 것을 명확하게 표현할 수 있다는 장점이 있다. 👉 한눈에 봐도 흐름이 읽히는 코드!
  - 반면 명령형 코드는 추상화의 수준이 낮고 대체로 특정 문제의 해결만을 목표로 하기 때문에 대체로 재사용성이 좋지 못하다. 추상화의 수준이 낮을수록 에러 가능성과 코드 복잡성이 증가한다.

  

  ### 느긋한 함수 체인의 예

  대표적으로 lodash의 chain 함수가 있다.

  - 복잡한 프로그램을 느긋하게 동작시킨다.
  - .value()함수를 호출하기 전까지 아무것도 실행하지 않는다.
  - 함수 체인을 사용하면 각 지점마다 데이터가 어떻게 변환되는지 분명해지기 때문에 데이터 흐름이 더 잘 보인다.

  ```typescript
  // AWS SQS의 task 메세지를 작성 하는 코드
  const chunk_messages: AWS.SQS.SendMessageBatchRequest[] = _(receivers)
        .map((receiver, i) => {
          return {
            Id: `${i}`,
            MessageBody: replacements ? JSON.stringify(replacements[i]) : '{}',
            MessageAttributes: {
              Type: {
                DataType: 'Number',
                StringValue: `${notification_type}`,
              },
              Receiver: {
                DataType: 'String',
                StringValue: receiver,
              },
              ...NotiService.getMessageAttributes(...),
            },
          };
        })
        .chunk(100)
        .map((entries) => ({ QueueUrl: SQS_email_normal_queue_URL, Entries: entries }))
        .value();
  ```

  



## 유사 SQL 데이터: 데이터로서의 함수

- 지금까지 lodash를 통해 본 함수들은 이름만으로도 각 함수가 하는 일이 무엇인지 어렵잖게 추론할 수 있다.

- 이 함수들이 SQL구문과 유사하다는 사실을 알 수 있다.

  ```sql
  SELECT p.firstname FROM Person p
  WHERE p.birthYear > 1991 and p.country IS NOT 'KO'
  GROUP BY p.firstname
  ```

  ```javascript
  _.mixin({
      'select': _.map,
      'from': _.chain,
      'where': _.filter,
      'sortBy': _sortByOrder
  });
  
  _.from(persons)
  	.where(p => p.birthYear > 1991 && p.address.country !== 'KO')
  	.sortBy(['firstname'])
  	.select(p => p.firstname)
  	.value(); 
  ```



## 재귀적 사고방식

재귀 함수는 어느 조건을 만족할 때까지 자기 자신을 호출하는 함수이다.
자바스크립트는 반복을 할 때, `for`, `while` 등의 반복문을 사용하지만, 함수형 프로그래밍에서는 반복문 대신 재귀를 사용한다.

내부적으로 재귀 호출 스택이 겹겹이 쌓이다가, 알고리즘이 종료 조건 (기저케이스)에 이르면 쌓인 스택이 런타임에 의해 풀리면서 반환문이 모두 실행되고, 이 과정에서 실제 연산이 본격적으로 이루어진다. 

재귀 함수의 주된 구성요소는 다음과 같다.

1. 탈출 조건, 즉 스스로 존재하는 원자적 정의를 만든다. (“기본 케이스, 기저 케이스” 라고 부른다)
2. 알고리즘의 어떤 부분이 재귀적인지를 정의한다. ("재귀 케이스")
   1. 함수가 자신을 호출할 때 전달한 입력 집합을 처리한다. 이 입력집합은 함수가 호출될 때 마다 점점 작아진다.

```javascript
/* sum 1..10 with loop */
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i + 1;
}
console.log(acc); // 55

/* sum 1..10 with recursion */
sumRange = ({ start, end }) =>
  (sum) => {
    if (start > end) { // 기저 케이스
      return sum;
    }
    return sumRange({ start: start + 1, end })(sum + start); // 재귀 케이스 (꼬리 위치에서 재귀를 호출하고 있다.)
  };
sumRange({ start: 0, end: 10 })(0);
```



### 재귀의 단점

꼬리 재귀 최적화가 되어있지 않은 언어에서는 재귀 사용 시 단점들이 있다.

- 반복문에 비해 속도가 느리다.
- 스택을 사용하기 때문에 반복이 많아질 경우, 스택오버플로우가 발생될 수도 있다.

`ES2015`의 `strict mode`는 `TCO`(Tail Call Optimization)를 제공하지만, ES5는 그렇지 않다. 따라서, ES5에서 일반 반복대신 재귀를 사용하는 것은 성능 상의 이슈를 가질 수 있다.



### Reference

[[번역] 자바스크립트의 재귀, PTC, TCO, STC 에 대한 모든 것](https://dongwoo.blog/2017/05/08/%EB%B2%88%EC%97%AD-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%9E%AC%EA%B7%80-ptc-tco-stc-%EC%97%90-%EB%8C%80%ED%95%9C-%EB%AA%A8%EB%93%A0-%EA%B2%83/)<br />



### 문제풀이

https://stackblitz.com/edit/js-uov76y