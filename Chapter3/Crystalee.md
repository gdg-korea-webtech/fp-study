# 자료구조는 적게, 일은 더 많이

## 어플리케이션의 제어 흐름

제어 흐름(control flow): 프로그램이 정답에 이르기까지 거치는 경로

- 명령형 프로그램: 작업 수행에 필요한 전 단계를 노출하여 흐름이나 경로를 아주 자세히 서술한다.
- 선언적 프로그램(특히 함수형 프로그램): 독립적인 블랙박스 연산들이 최소한의 제어 구조를 통해 연결되어 추상화 수준이 높다. 데이터와 제어 흐름 자체를 고수준 컴포넌트 사이의 단순한 연결로 취급한다.

연산을 `체이닝` 하면 간결하면서 표현적인 형태로 프로그램을 작성할 수 있다 >> 제어 흐름과 계산 로직을 분리할 수 있으며, 코드와 데이터를 더욱 효과적으로 헤아릴 수 있다.

## 메서드 체이닝

메서드 체이닝(method chaining): 여러 메서드를 단일 구문으로 호출하는 OOP패턴(메서드가 모두 동일한 객체에 속해 있으면 method cascading이라고도 한다)

객체지향 프로그램에서 불변 객체에 많이 적용하는 패턴이지만, 함수형에도 잘 맞는다.

```javascript
// 원본 문자열을 변경하지 않으면서 원본과는 무관한 새로운 문자열이 만들어진다.
const newString = 'Functional Programming'.substring(0, 10).toLowerCase() + 'is fun';
```

## 함수 체이닝

객체지향 프로그램은 주로 상속을 통해 코드를 재사용한다.

함수형 프로그램은 *자료구조를 새로 만들어 어떤 조건을 충족시키는 게 아니라*, 배열 등의 **흔한 자료구조**를 이용해 **다수의 굵게 나뉜 고계 연산을 적용**한다.

이러한 **고계연산**은 **작업을 수행하기 위해 해야 할 일이 기술된 함수를 인수로 받아서** 기존에 존재하던 **수동 루프(임시 변수의 값을 계속 바꾸면서 부수효과를 일으키는)를 대체**한다.

### 람다 표현식

함수형 프로그래밍에서 탄생한 **람다 표현식(Lambda expression. JS에서는 fat-arrow function)**은 한 줄짜리 익명 함수를 일반 함수 선언에 비해 간단하게 표현할 수 있다.

```javascript
const studyMember = ['Olaf', 'Hyunseob', 'Robin', 'Songs', 'Shinye', 'Crystalee'];
const email = (name) => name.toLowerCase() + '@gmail.com';
studyMember.map(email);
```

또한, *한줄짜리 fat-arrow function*으로 함수를 기술하는 경우, 항상 어떤 '값'을 반환하는 함수를 작성하게 되기 때문에 함수 정의부를 함수형으로 만들 수 있게 해준다

**[질문]** *92p 람다 표현식은 항상 어떤 값을 반환하게 만들어 함수 정의부를 확실히 함수형으로 굳힙니다.* >> 람다 표현식으로 함수를 기술하더라도 함수 몸체를 여러줄로 기술하고, 그 안에 return이 없으면 값을 반환하지 않는 형태가 되지 않나..?

`email`은 실재하는 '값'이 아니라, 그 값을 얻기 위한 (느긋한: 당장 계산하지 않고, 필요할 때 계산하는) 방법(**데이터를 계산하는 로직이 담긴 fat-arrow function**)을 가리킨다.

### _.map: 데이터를 변환

map(=collection): 배열 각 원소에 이터레이터 함수(파라미터로 받는 함수)를 적용하여 크기가 같은 새 배열을 반환하는 고계함수.

```javascript
map(studyMember, name => name.toUpperCase());
```

map함수는 루프를 쓰거나 괴팍한 스코프 문제를 신경 쓸 필요 없이 컬렉션의 원소를 전부 파싱할 경우 아주 유용하다. 항상 새로운 배열을 반환하기 때문에 불변성도 간직됨.

```javascript
function map(arr, fn) {
  const len = arr.length;
  const result = new Array(len);
  for(let index = 0; idx < len; ++idx) {
    result[idx] = fn(arr[idx], idx, arr);
  }
  return result;
}
```

map안에서는 일반 루프를 사용한다. map함수 내부에서 반복을 대행하기 때문에 개발할 때에는 이터레이터 함수(fn)에 구현한 로직만 신경쓰면 된다.

map함수는 배열의 왼쪽부터 오른쪽으로 순서대로 실행하기 때문에, 만약 거꾸로 실행하고 싶다면 기존 배열을 _.reverse() 함수를 이용하여 배열의 순서를 거꾸로 뒤집은 후 map 함수를 수행해야 한다. 이때 **reverse**함수는 원본 배열에 변이를 일으키므로 주의해야한다.

[tip] _() locashWrapper 이용하기

어떤 객체나 배열을 _(...)로 감싸면 LodashWrapper라는 래퍼객체로 감싸서 lodash의 모든 api함수를 (.)으로 계속 이어서 호출할 수 있다.

```javascript
_(studyMember).reverse().map(name => name !== null && name !== undefined ? name : '');
```

### _.reduce: 결과를 수집

reduce는 원소 배열을 하나의 값으로 짜내는 고계함수로, 원소마다 함수를 실행한 결괏값의 누적치를 계산한다.

```javascript
/**
 * @param arr
 * @param fn 배열 각 원소마다 실행할 이터레이터 함수. 
 *          [누산치, 현재 값, 인덱스, 배열] 을 매개변수로 받는다.
 * @param accumulator 계산할 초기값으로 넘겨받는 인수. 
 *                    함수 호출을 거치며 매 호출 시 계산된 결과값을 저장함.
 */
function reduce(arr, fn, accumulator) {
  let idx = -1;
  let len = arr.length;
  
  if (!accumulator && len > 0) {
    accumulator = arr[++idx];
  }

  while(++idx < len) {
    accumulator = fn(accumulator, arr[idx], idx, arr);
  }
  return accumulator;
}
```

많이 쓰이는 맵-리듀스 조합을 이용하면 작업을 단순화할 수 있다.(원하는 기능을 map, reduce에 이터레이터 함수로 넘기고, 이들을 연결하여 기능을 확장 >> `_(person).map(func1).reduce(func2)` 와 같이 사용하여 단일 결과값을 얻어낼 수 있다.)

(예를 들어 person이라는 객체배열이 있는 경우, func1에서 각 객체에서 학생들의 점수를 찾아내어 '각 학생들의 점수의 배열'을 reduce로 넘기면, func2에서 그 점수를 합산하도록 만들 수 있다.)

주의점

- map과 달리 reduce는 누산치에 의존하기 때문에 결합법칙이 성립하지 않는 연산(계산 순서가 결과에 영향을 미치는 연산)은 진행 순서(왼쪽 -> 오른쪽)에 따라 결과가 달라진다. (덧셈은 reduceRight와 reduce의 결과가 동일하지만, 나눗셈은 그렇지 않음)
- reduce는 일괄 적용(apply-to-all)연산이라서 배열을 순회하는 도중 그만두고 나머지 원소를 생략할 방법이 없다. >> 모든 함수를 순회할 필요가 없는 경우에는 `_.some()`, `_.every`, `_.isUndefined`, `_.isNull`을 사용하도록 하자.(some은 하나라도 주어진 조건을 만족하는 값이 발견되면 true를 반환하고 중단한다. <-> `_.every()`는 배열의 모든 요소가 주어진 이터레이터 함수에 대하여 true인지 확인하고, 중간에 만족하지 않는 것이 하나라도 발견되면 false를 반환하고 중단한다)

### _.filter: 원하지 않는 원소를 제거

filter(=selector)는 배열 원소를 반복하면서 술어 함수(매개변수로 넘긴 함수)가 true를 반환하는 원소만 추려내고 그 결과를 새 배열에 담아 반환하는 고계함수이다.(원래 함수의 부분집합을 반환한다)

- 오류 데이터를 제거하는 용도로 자주 쓰인다.( `_(person).filter(isValid).map(fullname);`이런 식으로..)
- 조건에 맞는 값을 찾기 위한 if-else들을 대체할 수 있다.

```javascript
/**
 * @param arr 대상 배열
 * @param predicate 원소를 결과에 포함할지 결정하는 술어 함수
 */
function filter(arr, prediate) {
  let idx = -1;
  let len = arr.length;
  let result = [];

  while(++idx < len) {
    let value = arr[idx];
    if (predicate(value, idx, this)) {
      result.push(value);
    }
    return result;
  }
}
```

**배열 축약**
map, reduce, filter를 조합하여 프로그래밍을 하는 대신, 배열 축약(array comprehension 또는 리스트 축약 list comprehension)이라는 개념을 적용하는 방법도 있다.

`[for (p of people) if (p.birthYear === 1903) p.fullname].join(' and ');`

`_(persons).filter(bornIn1903).map(fullname).join(' and ');`

위 두 줄은 동일한 기능을 수행한다. 전자는 배열 축약, 후자는 고계함수를 이용한 것.

## 코드 헤아리기

- 코드를 헤아린다: 프로그램의 일부만 들여다봐도 무슨 일을 하는 코드인지 멘털 모델을 쉽게 구축할 수 있다
- 멘털 모델: 전체 변수의 상태와 함수 출력 같은 동적인 부분뿐만 아니라, 설계 가독성 및 표현성 같은 정적인 측면까지 포괄하는 개념

### 선언적 코드와 느긋한 함수 체인

FP의 선언적 모델에 따르면, 프로그램이란 개별적인 순수함수들을 평가하는 과정이라 볼 수 있기 때문에 필요 시 코드의 흐름성과 표현성을 높이기 위한 추상화 수단을 지원하며, 이렇게 함으로써 개발하려는 어플리케이션의 실체를 명확하게 표현하는 온톨로지(ontology) 또는 어휘집(vocabulary)을 만들 수 있다.

[참고] **온톨로지(Ontology)** 란 사람들이 세상에 대하여 보고 듣고 느끼고 생각하는 것에 대하여 서로 간의 토론을 통하여 합의를 이룬 바를, 개념적이고 컴퓨터에서 다룰 수 있는 형태로 표현한 모델로, 개념의 타입이나 사용상의 제약조건들을 명시적으로 정의한 기술이다.

map, reduce, filter라는 구성요소를 바탕으로 순수함수를 쌓아가면 자연스레 흐름이 읽히는 수준으로 추상화하면 비로소 기반 자료구조에 영향을 끼치지 않는 방향으로 연산을 바라볼 수 있다.(어떤 자료구조를 사용하더라도 프로그램 자체의 의미가 달라지면 안됨)

함수형 프로그래밍은 자료구조보다 **연산**에 더 중점을 둔다. 블랙박스 컴포넌트들(배열을 순회하는 등의 일을 맡아서 하는 map, filter 등의 함수들)을 서로 연결만 해준다. -> 선언적으로 프로그램을 작성하게 된다.

``` javascript
var names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John Von Neumann', 'stephen_kleene'];

// 명령형
var result = [];
for(let i = 0; i < names.length; i++) {
  var n = names[i];
  if (n !== undefined && n !== null) {
    var ns = n.replace(/_/, ' ').split(' ');
    for(let j = 0; j < ns.length; j++) {
      var p = ns[j];
      p = p.charAt(0).toUpperCase() + p.splice(1);
      ns[j] = p;
    }
    if (result.indexOf(ns.join(' ')) < 0) {
      result.push(ns.join(' '));
    }
  }
}
result.sort();

// 함수형
_.chain(names)
  .filter(isValid)
  .map(s => s.replace(/_/, ' '))
  .uniq()
  .map(_.startCase)
  .sort()
  .value();

// 결과는 둘 다 동일하게 나온다.
// ['Alonzo Church', 'Haskell Curry', 'John Von Neumann', 'Stephen Kleene']
```

위 함수에서 **_.chain** 을 사용했다. `_.chain` 함수는 주어진 입력을 원하는 출력으로 변환하는 연산들을 연결함으로써 입력 객체의 상태를 확장한다. (임의의 함수를 명시적으로 체이닝 가능한 함수로 만든다. 마지막에 value()를 호출해야 결과값이 반환됨. <-> `_.()`은 암시적 연쇄로서 끝에 value()를 호출하지 않아도 단일 값으로 리듀스되는 함수가 연쇄될 경우 lodash가 알아서 체인을 종결한다.)

위와 같은 체인이 원활하게 작동하는 것은 체이닝되어있는 함수들이 '순수함수'이기 때문이다. 체인에 속한 각 함수는 이전 단계의 함수가 제공한 새 배열에 자신의 불변 연산을 적용한다.

프로그램 파이프라인을 느긋하게 정의할 때의 장점

- 가독성이 좋다
- 평가(evaluation) 이전에 정의하기 때문에 자료구조를 재사용하거나 메서드를 융합하여 최적화할 수 있다. (불필요한 호출을 제거할 수 있음)

### 유사 SQL 데이터

map, reduce, filter, groupBy, sortBy, uniq 등의 함수는 이름만으로도 함수가 데이터에 하는 일이 무엇인지 추측이 가능하다. -> SQL과 비슷함 -> SQL 처럼 대수학 개념을 활용해서 데이터 자체의 성격과 구조 체계를 더 깊이 추론할 수 있게 도움을 준다

```sql
-- 뒤에 작성할 함수의 SQL버전
SELECT p.firstname FROM Person p
WHERE p.birthYear > 1930 and p.country IS NOT 'US'
GROUP BY p.firstname
```

lodash의 mixin을 이용하면 핵심 라이브러리에 함수를 추가하여 확장하여 원래 있었던 함수처럼 체이닝할 수 있다.

```javascript
// 위에 작성한 SQL의 JavaScript버전
_.mixin({
  'select': _.map,
  'from': _.chain,
  'where': _.filter,
  'sortBy': _.sortByOrder,
})

_.from(persons)
  .where(p => p.birthYear > 1930 && p.address.country !== 'US')
  .sortBy(['firstname'])
  .select(p => p.firstname)
  .value();
```

자바스크립트 코드도 SQL처럼 데이터를 함수 형태로 모형화할 수 있는데, 이를 **데이터로서의 함수(functions as data)** 라는 개념으로 부르기도 한다.(선언적으로 어떤 데이터가 출력되어야 할지 서술할 뿐 그 출력을 어떻게 얻는지는 논하지 않음)

## 재귀적 사고방식

**재귀 recursion**: 주어진 문제를 자기 반복적인 문제들로 잘게 분해한 다음, 이들을 다시 조합해 원래 문제의 정답을 찾는 기법.

재귀 함수의 구성요소

- 기저 케이스(base case). 종료 조건(terminating condition)이라고도 한다. 구체적인 결과값을 바로 계산할 수 있는 입력 집합.
- 재귀 케이스(recursive case). 함수가 자신을 호출할 때 전달한 입력 집합(최초 입력집합보다 작음)을 처리.

함수가 반복될수록 입력 집합은 무조건 작아지며, 제일 마지막에 기저 케이스로 빠지면 하나의 값으로 귀결된다.

**재귀적 사고**: 자기 자신 또는 그 자신을 변형한 버전을 생각하는 것.

재귀는 변이가 없으므로, 더 강력하고 우수하며 표현적인 방식으로 반복을 대체할 수 있다.

```javascript
// 재귀적 덧셈
function sum(arr) {
  if (_.isEmpty(arr)) {
    return 0;
  }
  return _.first(arr) + sum(_.rest(arr));
}
sum([]); // 0
sum([1, 2, 3, 4, 5, 6, 7, 8, 9]) // 45
```

두번째 sum 함수 호출 시 내부적으로 재귀 호출 스택이 겹겹이 쌓인다. 재귀를 이용하여 언어 런타임에 루프를 맡기는 방식.

ES6부터는 꼬리 호출 최적화(tail-call optimization)까지 추가되어 사실상 재귀와 수동 반복의 성능 차이는 미미하다.

```javascript
// 꼬리호출?
function sum(arr, acc = 0) {
  if (_.isEmpty(arr)) {
    return 0;
  }
  return sum(_.rest(arr), acc + _.first(arr)); //꼬리 위치에서 재귀 호출
}
```

**재귀적으로 정의한 자료구조**
tree는 루트노드가 포함된 재귀적인 자료구조이다

```javascript
class Node {
  constructor(val) {
    this._val = val;
    this._parent = null;
    this._children = [];
  }

  isRoot() {
    return isValid(this._parent);
  }
  get children() {
    return this._children;
  }
  hasChildren() {
    return this._children.length > 0;
  }
  get value() {
    return this._val;
  }
  set value(val) {
    this._val = val;
  }
  append(child) {
    child._parent = this;
    this._children.push(child);
    return this;
  }
  toString() {
    return 'node:' + this._val + ', children: ' + this._children.length;
  }
}

class Tree {
  constructor(root) {
    this._root = root;
  }
  static map(node, fn, tree = null) { // root노드부터 전위순회함.
    node.value = fn(node, value);
    if (tree === null) {
      tree = new Tree(node);
    }
    if (node.hasChildren()) {
      _.map(node.children, function(child) {
        Tree.map(child, fn, tree);
      });
    }
    return tree;
  }
  get root() {
    return this._root;
  }
}
```

---

[week2 문제풀이](https://stackblitz.com/edit/fp-study-week2-homework1?file=.vscode%2Fsettings.json)

---
week3 문제

[버스에 남아있는 사람 찾기](https://www.codewars.com/kata/number-of-people-in-the-bus/train/javascript)

[재귀](https://www.codingame.com/playgrounds/2980/practical-introduction-to-functional-programming-with-js/recursion)
