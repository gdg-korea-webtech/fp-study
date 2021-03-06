# Chap 01. 함수형 프로그래밍 스터디

## 들어가며

> 객체지향은 가동부를 캡슐화하여 코드의 이해를 돕고, 함수형 프로그래밍은 가동부를 최소화하여 코드의 이해를 돕는다. -마이클 페더스

최근 클라이언트 영역이 급속도로 발전하고 있습니다. 많은 비지니스 로직들이 클라이언트 쪽으로 넘어오면서 서버와의 통신, 상태 공유, 데이터의 흐름과 전파, 이벤트 처리등 코드의 복잡도가 올라가고 있습니다.   
이러한 문제를 객체지향 방식으로 풀 수 있지만, 자바스크립트는 매우 동적인언어이기 때문에 코드의 가독성이 떨어지고 관리가 어려워집니다.  
전반적으로 봤을 때 요즘의 자바스크립트는 데이터에 흐름과 상태 공유에 대한 진지하게 고민하고 있는 프로그래밍 패러다임 시대입니다.  
함수형 프로그래밍은 API 나 라이브러리가 아닙니다. 문제를 작게 쪼개어 나온 목적을 가진 작은 단위의 함수끼리의 상호을 통해 데이터를 부수효과 없이 전파하고 상태 변이를 최소화하여 공유하는 프로그래밍 패러다임입니다.

## 기본 개념 

1. 선언적 프로그래밍
   선언적 프로그래밍이란 내부의 코드와 데이터의 흐름을 감추고 작업을 표현하는 것을 말합니다. 
   결과를 내기위해 상태를 위에서 아래로 늘어놓은 명령형 프로그램과는 다릅니다.

ex. 기존의 배열의 값에 2 를 곱한다라는 코드를 만들 떄

**명령형 프로그래밍**
원하는 작업을 어떻게 처리해야 하는지 상세히 표현합니다.

```js
const arr = [1, 2, 3, 4, 5];
const result = [];

for (var i = 0; i < arr.length; i += 1) {
  result[i] = arr[i] * 2;
}

console.log(result); // [2, 4, 6, 8, 10]
```

**선언적 프로그래밍** - 함수형 프로그래밍
같은 작업이라도 loop 에 대한 처리는 map 에게 맡기고 원하는 요소를 올바르게 동작하는 일만 처리하면 됩니다.

```js
const arr = [1, 2, 3, 4, 5];
const result = arr.map(num => num * 2);
console.log(result); // [2, 4, 6, 8, 10]
```

2. 순수함수, 부수효과
   함수형 프로그래밍은 기본적으로 불변성을 강조합니다.
   순수함수의 특징은 아래와 같습니다.
   주어진 입력에만 의존한다. 외부의 값과는 무관하게 동작해야한다.
   해당 함수 스코프 밖에는 어떠한 영향도 주지 않아야 한다.

위의 조건을 만족한다면 `순수` 하다고 표현할 수 있습니다.

```js
var number = 0;
function changeNumber() {
  number = 10;
}
changeNumber();
console.log(number); // 10
```

위의 `changeNumber` 함수는 자신의 스코프 밖에 있는 number 를 바꿔버립니다. 그러므로 이 함수는 `불순`합니다.

3. 참조 투명성, 치환성
   함수가 동일한 입력에 동일한 결과를 반환한다면 이 함수는 참조 투명한 함수입니다. 참조 투명한 함수를 만든다면 함수를 재작성하거나 치환하더라도 쉽게 파악할 수 있습니다.

4. 불변 데이터 유지 
   불변 데이터는 만들어진 후 값이 변하지 않습니다. 객체는 불변하지 않기 때문에 함수의 인자로 전달했을 때 부수효과가 일어날 수 있습니다.

   ```js
   const arr = [2, 1, 5, 4, 3];
   arr.sort();
   console.log(arr); // [1, 2, 3, 4, 5]
   ```

   위의 sort 라는 함수는 배열의 값을 정렬해주는 함수인데 arr 라는 값 자체를 정렬된 값으로 변경해버리는 부수효과를 일으킵니다.

**위의 특징들을 살펴보았을 때 함수형 프로그래밍은 부수효과가 없는 불변한 프로그램을 작성하기 위한 순수함수를 선언적으로 평가하는 것 입니다.**

## 함수형 프로그래밍의 좋은점

함수형 프로그래밍은 분해와 합성간의 상호작용입니다. 
문제에 대하여 작은 단위로 함수를 모듈화하고 합성하여 문제를 해결합니다. 
하나의 함수는 한가지의 목표만 가집니다. 
만들어진 함수를 체이닝(연결) 할 수 있습니다. 체인은 필요 시점까지 실행을 미루는 lazy evaluation 을 수행합니다. 불필요하게 코드를 전부 실행할 필요가 없어져 CPU 의 부하를 줄일 수 있습니다.

- 순수함수를 사용하기 때문에 전역의 상태를 깨뜨릴 일이 없습니다. 유지보수에 도움이 됩니다.
- 선언적으로 작성하기 때문에 코드의 가독성이 올라갑니다.
- 함수를 체인으로 연결하여 매끄러운 처리가 가능합니다.
- 함수를 기본 작업단위로 두기 때문에 모듈성, 재사용성을 올릴 수 있습니다.
- 리액티브 / 함수형 프로그래밍을 융합하면 이벤트 기반 프로그램의 복잡성을 줄일 수 있습니다.

## 알고리즘 문제

[정렬 - 가장 큰 수 찾기](https://programmers.co.kr/learn/courses/30/lessons/42746)
