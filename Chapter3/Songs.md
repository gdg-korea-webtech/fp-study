# Part2 함수형으로 전환하기
## Chapter3 자료구조는 적게, 일은 더 많이

date : 19.03.04

---

### 3.1 애플리케이션의 제어 흐름

**제어흐름** : 프로그램이 정답에 이르기까지 거치는 경로

- **명령형 프로그램**
  - 작업수행에 필요한 전 단계 노출하고 흐름이나 경로를 자세히 서술
  - 분기, 루프에 따라 움직이는 일련의 연산(구문)들로 구성
  
- **선언적, 함수형 프로그램**
  - 독립적인 블랙박스 연산들이 단순하게
  - 최소한의 제어 구조를 통해 연결 -> 추상화 수준 높음
  - 흐름과 계산 로직을 분리하여 코드와 데이터를 효과적으로 헤아릴수 있음


### 3.2 메서드 체이닝

- 여러 메서드를 단일 구문으로 호출하는 OOP패턴
- 메서드가 모두 동일한 객체에 속해 있으면 메서드 흘리기(method <u>cascading</u> )라고도 함
  * cascading : 최상위 노드부터 아래로 속성들이 쭉 흘러내려 폭포처럼 보이는 형태

```js
'functonal Programming'.substring(0,10).toLowerCase() + ' is fun';

//두 메서드는 문자열 객체에 접근하여 작업 한후 새로운 문자열을 반환
```

함수형으로 리팩터링
```js
concat(toLowerCase(substring('Functional Programming', 1, 10))), ' is fun');

//함수형을 충실히 반영한 코드지만 가독성이 떨어짐
//함수 코드를 안쪽에서 바깥쪽으로 작성하면 메서드 체이닝 방식만큼 매끄럽지 못함
```

### 3.3 함수 체이닝

- **객체지향**
  - 주로 상속을 통해 코드를 재사용
  - 부모의 형태와 메서드를 물려 받음

- **함수형**
  - 자료구조를 이용해 다수의 굵게 나뉜 **고계 연산**을 적용
  - 작업 수행을 위해 무슨 일을 해야 하는지 **기술된 함수를 인수**로 받음
  - 임시 변수의 값을 계속 바꾸면서 부수효과를 일으키는 **기존 수동 루프를 대체**
  - 관리할 코드와 에러 날 만한 **코드 감소**


#### 3.3.1 람다 표현식

- 함수형 프로그래밍에서 탄생
- 두줄 **화살표 함수** (fat-arrow function)라고도 함
- 일반 함수 선언보다 **단축된** 구문으로 나타냄
- 항상 어떤 값을 반환하게 만들어 함수 정의부를 확실히 함수형으로 굳힘
- 람다 표현식과 잘 어울리는 세 주요 고계함수 `map`, `reduce`, `filter` 적극 사용 권장
  
```js
const name = p => p.fullname; //매개변수 p를 받아 p.fullname을 반환
console.log(name(p1)); //-> 'Haskell Curry'

//주목할 점은 일급 함수와 람다 표현식의 관계!
//name은 실재하는 값이 아니라 그 값을 얻기 위한 (느긋한)방법을 가리킴
//즉 name으로 데이터를 계산하는 로직이 담긴 화살표 함수를 가리킴 (함수를 값처럼 사용가능), 느긋한 함수 개념은 7장에서...
```

**`로대시JS`**

- 함수형 프로그램을 작성하도록 유도하는 **함수형 라이브러리**
- 언더스코어JS에서 파생된 라이브러리로 언더스코어JS의 관례를 따름
- 내부적으로는 **함수 체인을 좀 더 우아하게 구축**하는 방향으로 완전히 재작성 되어 **성능 문제도 개선**된 라이브러리

---

#### 3.3.2 `_.map`: 데이터를 변환

덩치 큰 데이터 컬렉션의 원소를 모두 변환해야 할때..

ex) 학생 리스트에서 각자의 성명을 추출

> 흔한 명령형
```js
var result = [];
var persons = [p1, p2, p3, p4];

for(let i = 0; i < persons.length; i++) {
    var p = persons[i];
    if(p !== null && p !== undefined) {
        result.push(p.fullname);
    }
}
```

> _map을 사용한 함수형 스타일
```js
_.map(persons,
    s => (s !== null && s !== undefined) ? s.fullname : ''
);
//고계함수를 사용하여 변수 선언부를 없애고 배열을 반복하며 각 학생의 이름을 얻음
```

컬렉션의 원소를 전부 파싱할 경우 유용하며 항상 새로운 배열을 반환하므로 불변성도 유지가능
  
> 수학적 표현
```js
map(f, [e0, e1, e2...]) -> [r0, r1, r2...];

// f(en) = rn
// 함수 f와 n개의 원소가 담긴 컬렉션을 받아 
// 왼쪽 -> 오른쪽으로 각 원소에 f를 적용한 계산결과를 역시 크기가 n인 새 배열에 담아 반환
```

연산이 끝나면 **원본 배열은 건드리지 않은 채** 다음 원소가 포함된 **새 배열**이 반환

> map 구현부
```js
function map(arr, fn) {             
    const len = arr.length,
          result = new Array(len);  
    for (let idx = 0; idx < len; ++idx) {
        result[idx] = fn(arr[idx], idx, arr); 
    }
    return result;
}

//배열과 함수를 인수로 받아 배열 원소마다 함수를 실행하고 그 결과를 원본과 크기가 같은 새 배열에 담아 반환
```

기본적으로 왼쪽 -> 오른쪽 방향으로 진행하며 오른쪽에서 왼쪽으로 진행하려면 Array.reverse(), 로대시에서는 _.reverse() 메서드 사용 

---

#### 3.3.3 `_.reduce`: 결과를 수집

변환된 데이터로부터 의미 있는 결과를 도출

- 원소 배열을 **하나의 값**으로 짜내는 고계함수
- 원소마다 함수를 실행한 결괏값의 **누적치**를 계산하고 배열이 끝날때 까지 반복


> 수학적 표현
```js
reduce(f, [e0, e1, e2, e3], accum) -> f(f(f(f(acum, e0), e1, e2, e3))) -> R
```

> reduce 구현부
```js
function reduce(arr, fn, accumulator) {
    let idx = -1,
        let = arr.length;
    
    //누산치를 지정하지 않으면 배열의 첫 번째 원소를 초깃값으로 설정
    if (!accumulator && len > 0){
        accumulator = arr[++idx];
    }

    //배열을 반복하면서 원소마다 누산치, 현재 값, 인덱스, 배열을 인수로 fn을 실행
    while (++idx < len) {
        accumulator = fn(accumulator, arr[idx], idx, arr);
    }

    //단일 누산치를 반환
    return accumulator;
}
```
> reduce가 받는 매개변수

- **fn** : 배열 각 원소마다 실행할 이터레이터 함수, 매개변수는 누산치, 현재 값, 인덱스, 배열
- **accumulator** : 계산할 초깃값으로 넘겨받는 인수, 함수 호출을 거치며 매 호출 시 계산된 결괏값 저장


> 국가별 인구 계산
```js
_(persons).reduce((stat, person) => {
    //거주 국가를 얻는다
    const country = person.address.country;
    
    //country는 1로 초기화한 후 해당 국가에 거주하는 사람이 있을 때마다 하나씩 더한다
    stat[country] = _.isUndefined(stat[country]) ? 1 : stat[country] + 1;

    //누산 객체 반환
    return stat;
}, {}); //빈 객체로 리듀스를 시작 (누산치 초기화)


//실행결과, Persons배열을 토대로 국가별 인구 산출하여 단일 객체에 담는다
{
    'US': 2,
    'Greece': 1,
    'Hungary': 1
}
```

> map, reduce 조합
```js
//map으로 객체 배열을 처리하여 국가 정보 추출
const getCountry = person => person.address.country;

//reduce로 최종결과 수집
const getherStats = function (stat, criteria) {
    stat[ciriteria] = _.isUndefined(stat[criteria]) ? 1 : 
        stat[criteria] + 1;
    return stat;
};

_(person).map(getCountry).reduce(gatherStats, {});
```

> 코드 보완 (p.105)
```js
const getherState = function(stat, country) {
    if(!isValid(stat[country])) {
        stat[country] = {'name':country, 'count':0};
    }
    stat[country].count++;
    return stat;
};
```


> 렌즈 사용 (person객체의 address.city속성에 초점)
```js
const cityPath = ['address', 'city'];
const cityLens = R.lens(R.path(cityPath), R.assocPath(cityPath));

//거주 도시별 인구 산출
_(persons).map(R.view(cityLens)).reduce(getherStats, {});

//_.groupBy 사용
_.groupBy(persons, R.view(cityLens));
```

**reduce 특징**
- 누산치에 의존하기 때문에 덧셈은 결과가 같지만 나눗셈의 경우 다른 결과 도출 
  ```JS
  //_.divide
  ([1,3,4,5]).reduce(_.divide) !== ([1,3,4,5]).reduceRight(_.divide);
  ```
- **일괄적용 연산**이라 배열 순회 도중 그만 둘수 없음
- 리스트 값을 빠짐없이 방문하므로 다소 비효율적 (잘못된 값이 하나라도 발견되면 나머지 값들은 더이상 체크할 필요가 없므로)

> `_.some`, `_.isUndefined`, `_.isNull` 사용해서 효율적인 검증기 만들기
> 
> 주어진 조건을 만족하는 값 발견 즉시 true를 반환

```js
const isNotValid = val => _.isUndefined(val) || _.isNull(val);

//하나라도 true면 some 함수를 즉시 반환
//최소한 하나의 값이라도 올바른지 확인할때 유용
const notAllValid = args => _(args).some(isNotValid);

notAllValid(['string', 0, null, undefined]); //-> true
notAllValid(['string', 0, {}]); //-> false
```

> allValid : 주어진 술어가 모든 원소에 대해 true인지 _.every로 체크
```js
const isValid = val => !_.isUndefined(val) && !_.isNull(val);
const allValid = val => _(args).every(isValid);

allValid(['string', 0, null]); //-> false
allValid(['string', 0, {}]); //-> true
```

#### 3.3.4 `_.filter`: 원하지 않는 원소를 제거

- 계산을 시작하기 전에 특정 원소를 미리 솎아내는 처리
- 배열 원소를 반복하면서 술어 함수가 true를 반환하는 원소만 추려내고 그 결과를 새 배열에 담아 반환하는 고계함수
- 대상 **배열**과, 원소를 결과에 포함할지 결정하는 술어 **함수** 두 가지를 인수로 받음
  
> filter 구현부
```js
function filter(arr, predicate) {
    let idx = -1,
        len = arr.length;
        result = []; //입력받은 배열의 부분집합

    while (++idx < len) {
        let value = arr[idx];
        if(predicate(value, idx, this)) {
            result.push(value);
        }
    }
    return result;
}
```

**사용예**

> 배열에서 오류 데이터를 제거
```js
_(persons).filter(isValid).map(fullname);
```

> Person 객체 컬렉션에서 1903년 출생자들만 추출
```js
_(persons).filter(bornIn1903).map(fullname).join(' and ');

//-> 'John von Neumann and Alonzo Chruch'
```

**배열 축약**

`map, filter`의 기능을 각각 `for...of`와 `if` 키워드를 이용하여 단축된 구문으로 캡슐화하는 함수형 장치

간결한 구문으로 새 배열 조립 가능, 전체 표현식을 `[]`로 랩핑
```js
[for (x of 이터러블) if (조건) x)]
[for (p of people) if (p.birthYear === 1903) p.fullname].join(' and ');
```

> 확장성 좋고 강력한 함수를 이용해서 코딩하면 코드가 깔끔해지고 데이터를 더 잘 이해할 수 있다.
>
> 선언적 스타일은 **어떤 결과를 내야하는지**에 전념하게 하여 애플리케이션을 **더 깊이 있게** 헤아리는 데 큰 도움이 된다.


### 3.4 코드 헤아리기

**코드를 헤아린다** : 프로그램의 일부만 들여다봐도 무슨 일을 하는 코드인지 멘털 모델을 쉽게 구축 가능

함수형 흐름은 프로그램 로직을 파헤치지 않아도 뭘 하는 프로그램인지 윤곽을 잡기 쉬워 코드뿐만 아니라, 결과를 내기 위한 데이터의 흐름까지 더 깊이 헤아릴 수 있음

#### 3.4.1 선언적 코드와 느긋한 함수 체인

- 어떤 자료구조를 쓰더라도 프로그램 자체의 의미가 달라져선 안됨
- 자료구조보다 **연산**에 더 중점
  
```js
var names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John Von Neumnaa', 'stephen_kleene'];
```

> 함수형
```js
_.chain(names)  //함수체인 초기화
    .filtler(isValid)   //잘못된 값 제거
    .map(s => s.replace(/_/, ' '))  //값 정규화
    .uniq() //중복 솎아냄
    .map(_.startCase)   //대소문자 맞춤
    .sort()
    .value();
```

> 인구가 가장 많은 국가 반환
```js
_.chain(persons)
    .filter(isValid)

    //person 객체의 address.country 속성 얻기
    //_.property는 R.view()와 거의 같은 로대시 JS 함수
    .map(_.property('address.country')) 

    .reduce(gatherStats, {})
    .values()
    .sortBy('count')
    .reverse()
    .first()
    .value()
    .name;  //-> 'US'
```

`_.chain` 
- 함수는 주어진 입력을 원하는 출력으로 변환하는 연산들을 연결 -> 입력 객체의 상태를 확장
- 임의의 함수를 명시적으로 체이닝 가능한 함수로 만듦
- 복잡한 프로그램을 느긋하게 작동시키는 장점
- 결과값이 필요없는 함수는 실행을 건너뛸 수 있음 -> 성능에 영향


#### 3.4.2 유사 SQL 데이터 : 데이터로서의 함수

SQL구문을 닮은 함수, 쿼리 언어를 구수하듯 함수형 프로그래밍에서 배열에 연산을 적용

```
SELECT p.firstname FROM Person p
WHERE p.birthYear > 1903 and p.country IS NOT 'US'
GROUP BY p.firstname
```

>믹스인
```js
_.mixin({'select': _.map,
         'from': _.chain,
         'where': _.filter,
         'sortBy': _.sortByOrder});
```

>자바스크립트를 SQL 비슷하게 작성하기
```js
_.from(persons)
    .where(p => p.birthYear > 1900 && p.address.country !== 'US')
    .sortBy(['firstname'])
    .select(p => p.firstname)
    .value();
```

자바스크립트 `mixin`은 다른 객체의 로직을 확장하는 용도로 활용


`데이터로서의 함수(function as data)`

자바스크립트 코드도 SQL처럼 데이터를 함수 형태로 모형화 가능

선언적으로 `어떤` 데이터가 출력되어야 할지 서술 출력을 어떻게 얻는지는 논하지 않음


### 3.5 재귀적 사고방식

#### 3.5.1 재귀란?

`재귀(recursion)`: 주어진 문제를 자기 반복적인 문제들로 잘게 분해 후 이들을 다시 조합해 원래 문제의 정답을 찾는 기법

**주된 구성요소**
- `기저 케이스` base case (종료 조건 terminating condition)
  - **기저케이스는**
  - 재귀 함수가 구체적인 결괏값을 바로 계산할 수 있는 입력 집합
  - 재귀 케이스는 함수가 자신을 호출할 때 전달한 입력 집합을 처리
  - 함수가 반복될수록 입력 집합은 무조건 작아짐
  - 제일 마지막에 기저 케이스로 빠지면 하나의 값으로 귀결
- `재귀 케이스` recursion case


#### 3.5.2 재귀적으로 생각하기

재귀적 객체는 스스로를 정의, 자기 자신 또는 그 자신을 변형한 버전을 생각하는 것

>명령형 반복 합 루프 
```js
var acc = 0;
for(let i = 0; i < nums.length; i++) {
    acc += nums[i];
}
```

>함수형
```js
_(nums).reduce((acc, current) => acc + current, 0);
```

>재귀적 덧셈
```js
function sum(arr) {
    //기저케이스 (종료조건)
    if(_.isEmpty(arr)) {
        return 0;
    }

    //재귀케이스 _.first와 _.rest로 입력을 점점 줄여가며 자신을 호출
    return _.first(arr) + sum(_.rest(arr));
    
    sum([]); //-> 0
    sum([1,2,3,4,5,6,7,8,9])); //-> 45
}
```

>sum함수롤 다른 방법으로 구현
```js
function sum(arr, acc = 0){
    if(_.isEmpty(arr)) {
        return 0;
    }
    return sum(_.rest(arr), acc + _.first(arr)); ?
    //함수 본체의 가장 마지막 단계, 꼬리 위치에서 재귀호출 (이점은 7장 함수형 최적화에서...)
}
```

#### 3.5.3 재귀적으로 정의한 자료구조

```js
class Tree {
    contstructor(root) {
        this._root = root;
    }

    static map(node, fn, tree = null) {
        node.value = fn(node.value);
        if(tree === null) {
            tree new Tree(node);
        }

        //기저 케이스
        if(node.hasChidren()) {
            _.map(node.children, function (child) {
                Tree.map(child, fn, tree); //각 자식노드 재귀호출
            });
        }
        return tree;
    }
    get root() {
        return this._root;
    }
}
```

Tree.map 함수는 루트 노드 및 각 노드 값을 반환하는 이터레이터 함수를 필수로 받음
```js
Tree.map(chruch, p => p.fullname);
```

>함수형 프로그래밍은 **고수준의 연산을 일련의 단계들로 체이닝**하는, 간결한 **흐름 중심**의 모델을 선호

---

### week2 문제

- [quest2 - httpClient](https://stackblitz.com/edit/quest2-httpclient)
- [quest2 - clouser-fontSize](https://stackblitz.com/edit/closure-practice1)
- [Practical_closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Practical_closures)

---

### week3 문제

해당문자열이 포함되어 있는지 필터링 하는 `filterItems` 함수 작성
```js
const fruits = ['apple', 'banana', 'grapes', 'mango', 'orange'];

function filterItems(query){
  //여기 작성
}
console.log(filterItems('a'));
```
