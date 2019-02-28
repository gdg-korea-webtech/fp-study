# Chap 03. 함수형 프로그래밍 스터디

> 계산 프로세스는 컴퓨터에 내재하는 추상적인 존재다. 이들이 점점 진화하면서 프로세스는 데이터라는 또 다른 추사엊ㄱ인 존재에 영향을 끼친다.

## 자료구조는 적게, 일은 더 많이 

### 제어 흐름
프로그램이 `정답`에 이르기까지 거치는 경로를 `제어 흐름` 이라고 합니다. 
명령형 프로그램은 작업 수행에 필요한 전 단계를 노출하여 흐름과 경로를 자세히 표현하고, 
선언적 프로그램 특히 함수형 프로그램은 독립적인 `블랙박스` 연산들을 최소한의 제어 구조를 통해 연결시켜 추상화를 높입니다.  
함수형 프로그래램의 경우 데이터와 제어 흐름 자체를 컴포넌트 사이의 단순한 `연결`로 취급합니다. 

### 메서드 체이닝 
`메서드 체이닝`이란 여러 메서드를 단일 구문으로 호출하는 OOP 패턴입니다. 

```js
'Functional Programming'.substring(0, 10).toLowerCase() + 'is fun'
```

substring, toLowerCase 는 자신을 소유한 문자열 객체에 작업을 한 후 새로운 문자열을 반환합니다.

함수형으로 리팩토링한 코드는 아래와 같습니다. 

```js
concat(toLowerCase(substring('Functional Programming', 0, 10)), 'is Fun')
```

### 함수 체이닝 

함수형 프로그래밍은 자료구조를 새로 만드는 것이 아니라, 배열등 흔한 자료구조를 이용하여 굵게 나뉜 고계 연산을 적용합니다.

- 작업을 수행하기 위해 무슨 일을 해야하는지 기술된 함수를 받는다.
- 부수효과를 일으키는 기존 수동 루프를 대체합니다. 관리할 코드가 줄고 에러를 방지할 수 있습니다.

### 람다 표현식

람다 표현식 (자바스크립트 에서는 두 줄 화살표 함수) 는 익명 함수를 일반 함수 선언보다 단축된 구문으로 나타냅니다. 

```js
const name = p =>p.fullname;
console.log(name(p1))
```

### Lodash

Lodash 는 개발자가 함수형 프로그램을 작성하도록 유도하고, 공통적인 프로그래밍 작업을 처리하는 유용한 헬퍼 함수를 제공합니다.

#### _.map

큰 데이터 컬렉션의 원소를 모두 변환해야 할 때가 있습니다.

```js

for (let i = 0; i < persons.length; i += 1) {
  var p = person[i];
  if (p !== null && p !== undefined) {
    result.push(p.fullname);
  }
}
```

위의 코드를 map 을 통해 변경해보겠습니다. map 함수는 루프를 쓰거나 스코프 문제를 신경쓸 필요 없습니다. 새로운 배열을 반환합니다.

```js
_.map(persons, s => (s !== null && s !== undefined) ? s.fullname : '')
```

구현부는 아래와 같습니다.

```js
function map(arr, fn) {
  const len = arr.length;
  const result = new Array(len)

  for(let idx = 0; idx < len; i += 1) {
    result[idx] = fn(arr[idx], idx, arr)
  }
  return result
}
```

#### _.reduce

reduce 는 원소마다 함수를 실행한 결과값의 누척치를 계산합니다. 

```js
function reduce(arr, fn, accumulator) {
  let idx = -1;
  let len = arr.length;

  if(!accumulator && len > 0) {
    accumulator = arr[++idx];
  }
  while(++idx < len) {
    accumulator = fn(accumulator, arr[idx], idx, arr);
  }
  return accumulator
}
```

reduce 는 일괄적용 연산이기 떄문에 배열을 순회하는 도중 그만두고 나머지 원소를 생략할 수 있는 방법이 없습니다. 전체 배열을 순회해야합니다.  
_.some, _.isUndefined, _.isNull 같은 함수를 써서 효율적인 검증기를 만들 수 있습니다.  

`_.some` 은 만족하는 값이 발견되면 즉시 `true`를 반환합니다. 

```js
const isNotValid = val => _.isUndefined(val) || _.isNull(val)
const notAllValid = args => _(args).some(isNotValid)

notAllValid(['a', 0, null, undefined]) // => true 
```

#### _.filter 

reduce 와 map 은 배열 원소를 모두 탐색합니다. 모든 원소를 처리하지 않고 null 이나 undefined 같은 특정 객체를 건너뛰어야 할 경우 filter 를 이용할 수 있습니다.

```js
function filter(arr, predicate){
  const idx = -1;
  const len = arr.length;
  const result = [];

  while(++idx < len) {
    let value = arr[idx];
    if(predicate(value, idx, this)) {
      result.push(value)
    }
  }
  return result;
}

_(person).filter(isValid).map(fullname)
``` 

## 코드 헤아리기 

최근 비즈니스 로직을 모듈 단위로 구분하는 문제에 사람들이 관심을 갖기 시작했습니다. 
불변성과 순수함수는 설계 가독성 및 표현성 같은 정적인 측면을 포함한 멘털 모델 구축을 좀 더 용이하게 해줍니다. 

### 선언적 코드와 느긋한 함수 체인 
FP 의 선언적 모델에 따르면 프로그램이란 개별적인 순수함수들을 평가하는 과정이라고 볼 수 있습니다.  
필요시 코드의 흐름성과 표현성을 높이기 위한 추상화 수단을 지원합니다. 

함수형 프로그래밍은 자료구조보다 연산에 더 중점을 둡니다. 배열, 연결리스트등 어떤 자료구조를 사용하더라도 프로그램 자체의 의미가 달라지면 안됩니다. 

추상화 수준이 낮을수록 코드를 재사용할 기회는 줄어들고 에러 가능성과 코드 복잡성은 증가합니다. 

```js
// lodash 로 만드는 느긋한 함수 체인 
_.chain(persons).filter(isValid).reduce(getherStats, {}).value()
```

chain 은 변환하는 연산들을 연결함으로써 입력 객체의 상태를 확장합니다. 가장 마지막의 value 가 호출되기 전에는 아무것도 실행되지 않습니다. 느그하게 프로그램을 작동시키는 장점을 가지고있습니다. 
프로그램의 파이프라인을 느긋하게 정의하면 가독성을 비롯해 여러모로 이롭습니다. 데이터가 어떻게 변화되는지 한눈에 확인할 수 있습니다.

### 유사 SQL 데이터: 데이터로서의 함수 

map, reduce, filter, groupBy 등 어휘만으로도 함수가 데이터에 하는 일이 무엇인지 추론할 수 있습니다. SQL 구문과도 닮았습니다.

```text
SELECT p.firstname FROM Person p
WHERE p.birthYear > 1903 and p,country IS NOT 'US'
GROU BY p.firtname
```

lodash 가 지원하는 믹스인 기능을 응용하면 위와 같은 표현이 가능해집니다.

```js
_.mixin({
  'select': _map,
  'form': _.chain,
  'where': _.filter,
  'sortBy': _.sortByOrder
})

_.from(persons)
  .where(p => p.birthYear > 1900 && p.address.country !== 'US')
  .sortBy(['firstname'])
  .select(p => p.firstname)
  .value()
```

자바스크립트도 SQL 처럼 데이터를 함수 형태로 모형화할 수 있습니다. 이를 데이터로서의 함수라는 개념으로 부르기도 합니다. 

## 재귀적 사고방식
복잡한 문제는 문제를 분해할 방법을 찾아야 합니다. 전체 문제를 더 작은 문제로 쪼갤 수 있다면 하나씩 풀면서 전체 문제를 풀 수 있습니다.

### 재귀란?
재귀는 주어진 문제를 반복적인 문제들로 잘게 분해한 다음, 다시 조합해 원래 문제의 정답을 찾는 기법입니다. 

### 재귀적으로 생각하기 
재귀적 사고란 자기 자신또는 그 자신을 변형한 버젼을 생각하는 것 입니다. 

아래는 숫자 배열의 원소를 모두 더하는 간단한 예제입니다.

```js
let acc = 0
for(let i = 0; i < nums.length; i += 1) {
  acc += nums[i] 
}
```

reduce 를 이용하여 함수형으로 변경하기

```js
_(nums).reduce((acc, current) => acc + current, 0);
```

재귀형 사고로 확장하기 

```js
sum[1,2,3,4,5,6,7,8,9] = 1 + sum[2,3,4,5,6,7,8,9]
                         1 + 2 + sum[3,4,5,6,7,8,9] // .....
```

```js
function sum(arr) {
  if(_.isEmpty(arr)){
    return 0
  }
  return _.first(arr) + sum(_.rest(arr))
}
```

ES6 부터는 꼬리 호출 최적화 까지 추가되어 재귀와 수동 반복의 성능 차이는 미미해졌습니다. 

```js
function sum(arr, acc = 0) {
  if(_.isEmpty(arr)) {
    return 0
  }
  return sum(_.rest(arr), acc + _.first(arr))
}
```

### 재귀적으로 정의한 자료구조

트리는 XML 문서, 파일 시스템, 분류학 등등 다양한 분야에서 쓰이는 일반적인 자료구조입니다. 
자바스크립트는 언어 자체로 내장 트리 객체를 지원하지 않기 떄문에 노드 기반의 단순한 자료구조를 만들어야 합니다. 


노드는 값을 지닌 객체로 자신의 부모와 자식 배열을 레퍼런스로 참조합니다. 

```js
class Node {
  consructor(val) {
    this._val = val
    this._parent = null
    this._children = []
  }

  isRoot() {
    return isValid(this._parent)
  }

  get children() {
    return this._children
  }

  hasChildren() {
    return this._children.length > 0
  }

  get value() {
    return this._val
  }

  set value(val) {
    this._val = val 
  }

  append(child){
    child._parent = this
    this._children.push(child)
    return this
  }
  
  toString() {
    return `Node (val: ${this._val}, children: ${this._children.length}`
  }
}

new Node(new Person('olaf'))
```

```js
class Tree {
  constructor(root){
    this._root = root
  }

  static map(node, fn, tree = null) {
    node.value = fn(node.value)
    if(tree === null) {
      tree = new Tree(node)
    }

    if(node.hasChildren()) {
      _.map(node.children, funciton(child) {
        Tree.map(child, fn, tree)
      })
    }
    return tree
  }
  get root () {
    return this._root
  }
}
```

루트 노드에서 출발한 전위 순회는 다음 과정을 거칩니다.

- 루트 원소의 데이터를 표시
- 전위 함수를 재귀 호출하여 왼쪽 하위 트리를 탐색
- 같은 방법으로 오른쪽 하위 트리를 탐색 


## 마무리
함수형 프로그래밍은 원하는 결과를 얻기 위한 비즈니스 로직이 담겨 있는 고수준의 연산을 일련의 단계들로 체이닝하는, 간결한 흐름 중심의 모델을 선호합니다.



# 2 week 문제

- 현섭님 문제: https://stackblitz.com/edit/js-9gaptx
- 송희님 문제: https://stackblitz.com/edit/js-6peuwr


# 문제

```js
concat(toLowerCase(substring('Functional Programming', 0, 10)), 'is Fun')
```

구현해보기