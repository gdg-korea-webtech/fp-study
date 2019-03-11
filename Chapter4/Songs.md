# Part2 함수형으로 전환하기
## Chapter4 재사용 가능한, 모듈적인 코드로

date : 19.03.11

---

**모듈성** : 프로그램을 더 작고 독립적인 부분으로 나눌 수 있는 정도

### 4.1 메서드 체인 대 함수 파이프라인

**파이프라이닝** : 함수를 연결하는 또 다른 기법

- 메서드를 체이닝 (단단한 결합, 제한된 표현성)
- 함수 파이프라인을 배열 (느슨한 결합, 유연성)
  
#### 4.1.1 메서드를 여럿 체이닝

체인을 끊어버리고 독립적인 함수열을 자유롭게 배열하기 위해 함수 파이프라인이 필요

#### 4.1.2 함수를 파이프라인에 나열

**파이프라인** : 한 함수의 출력이 다음 함수의 입력이 되게끔 느슨하게 배열한 방향성 함수 순차열

- 체이닝 : 객체 메서드를 통해 함수들을 단단히 결합
- 파이프라인 : 함수 입출력을 서로 연결 지어 느슨하게 결합된 컴포넌트를 만듦

### 4.2 함수 호환 요건

두가지 측면에서 입력과 출력이 서로 호환 되어야함
- 형식 : 한 함수의 반환 형식과 수신 함수의 인수 형식이 일치해야함
- 항수 : 수신 함수는 앞 단계 함수가 반환한 값을 처리하기 위해 적어도 하나 이상의 매개 변수 선언

#### 4.2.1 형식이 호환되는 함수

한 함수가 반환하는 것과 다른 함수가 받는 것이 반드시 호환되어야 함

#### 4.2.2 함수와 항수: 튜플

**항수** : 함수가 받는 인수의 개수 (함수의 길이)

FP에서는 함수에 선언된 인수의 개수가 참조 투명성의 당연한 결과로서 복잡도와 정확히 비례하는 경우 가 많음

**튜플** : 유한 원소를 지닌 정렬된 리스트, 형식이 다른 원소를 한데 묶어 다른 함수에 건네주는 일이 가능한 불변성 자료구조

- **불변성** : 튜플은 한번 만들어지면 내용을 바꿀 수 없음
- **임의 형식의 생성 방지** : 전혀 무관한 값을 서로 연관 지을 수 있음
- **이형 배열의 생성 방지** : 동일한 형식의 객체를 담는 자료구조

>튜플을 이용한 isValid 함수
```js
//trin :: String -> String
const trim = (str) => str.replace(/^\s*|\s*$/g, '');

//normalize :: String => String
const normalize = (str) => str.replace(/\-/g, '');

//isValid :: String -> Status
const isValid = function (str) {
    if(str.length === 0) {
        //상태 및 에러 메시지값을 보관할 Status 형식 선언
        return new Status(false,
        '잘못된 입력입니다. 빈 값일 리 없지요');
    }
    else {
        return new Status(true, '성공');
    }
}

isValid(normalize(trim('444-44-444'))); //-> (true, 성공);)
```

**해체 할당**과 조합하여 튜플 값을 변수로 매핑

>StringPair형식
```js
const StringPair = Tuple(String, String);
const name = new StringPair('Barkley', 'Rosser');

[first, last] = name.values();
first; //-> Barkley
last; //-> Rosser

//항수가 맞지 않아 에러발생
const fullname = new StringPair('J', 'Barkley', 'Rosser'); 
```

### 4.3 커리된 함수를 평가

**커링** : 다변수 함수가 인수를 전부 받을 때까지 실행을 보류, 지연시켜 단계별로 나뉜 단항 함수의 순차열로 전환하는 기법

>두 인 수를 수동으로 커리
```js
function curry2(fn){
    return function(firstArg) {
        return function(secondArg) {
            return fn(firstArg, secondArg);
        };
    };
}
```

```js
const name = curry2((last, first) => new StringPair(last, first));

[first, last] = name('Curry', 'Haskell').values();
first; //-> Curry
last; //-> Haskell
```

#### 4.3.1 함수 팩토리를 모방

평가하는 부분과 정의한 부부을 분리 가능하고 함수 템플릿을 여러 만들수 있음

#### 4.3.2 재사용 가능한 함수 템플릿 구현

```js
const logger = function(appender, layout, name, level, message) {
    //원하는 붙이기를 정의
    const appenders = {
        'alert' : new Log4js.JSAlertAppender(),
        'console' : new Log4js.BrowserConsoleAppender()
    };

    //원하는 레이아웃 제공기를 정의
    const layouts = {
        'basic' : new Log4js.BasicLayout(),
        'json' : new Log4js.JSONLayout(),
        'xml' : new Log4js.XMLLayout()
    };

    const appender = appenders[appender];
    appender.setLayout(layouts[layout]);
    const logger = new Log4js.getLogger(name);
    logger.addAppender(appender);
    logger.log(level, message, null); //구성 매개변수를 모두 적용해서 로그를 남김
}
```

커링의 가장 중요한 의의는 다인수 함수를 **단항 함수**로 바꾼다는 것

### 4.4 부분 적용과 매개변수 바인딩

**부분 적용** : 함수의 일부 매개변수 값을 처음부터 고정시켜 항수가 더 작은 함수를 생성하는 기법

매개변수가 5개인 함수가 있을 때 3개의 값을 제공하면 나머지 두 매개변수를 취할 함수가 생겨남

- 커링 : 부분 호출할 때마다 단항 함수 중첩 생성, 내부적으로는 이들을 단계별로 합성하여 최종 결과를 냄, 여러 인수를 부분 평가하는 식으로 변용 가능하여 개발자가 평가 시점과 방법을 좌지우지 할 수 있음
  
- 부분 적용 : 함수 인수를 미리 정의된 값으로 묶은 후 인수가 적은 함수를 새로 만듦, 함수는 자신의 클로저에 고정된 매개변수를 가지고 있으며 후속 호출 시 이미 **평가를 마친** 상태

>커링
```js
var curriedFn = function(a) {
    return function(b) {
        return function(c) {
            return a + ", " + b + ", " + c + "는 좋은 친구들";
        };
    };
};
```

>부분 적용
```js
var partialAppliedFn = function(a) {
    return function(b,c) {
        return a + ", " + b + ", " + c + "는 좋은 친구들"
    }
}
```

#### 4.4.1 언어의 핵심을 확장

#### 4.4.2 지연된 함수에 바인딩

```js
const Scheduler = (function () {
    const delayedFn = _.bind(setTimeout, undefined, _, _);

    return {
        delay5: _.partial(delayedFn, _, 5000),
        delay10: _.partial(delayedFn, _, 10000),
        delay: _.partial(delayedFn, _, _)
    };
})();

Schedular.delay5(function() {
    consoleLog('5초 후 실행')
});
```

### 4.5 함수 파이프라인을 합성

#### 4.5.1 HTML 위젯에서 합성하기

```js
const Node = Tuple(Object, Tuple);
const element = R.curry((val, tuple) => new Node(val, tuple));
//머리와 꼬리가 재귀적으로 이루어져 null로 끝나는 어떤 형식의 리스트라도 생성 가능
```

#### 4.5.2 함수 합성 : 서술과 평가를 구분

**함수 합성** : 복잡한 작업을 한데 묶어 간단한 작업으로 쪼개는 과정

```js
const str = `We can only see a short distance
            ahead but we can see plenty there
            that nedds to be done`;

//문장을 단어 배열로 나눔
const explode = (str) -> str.split(/\s+/);

//단어 개수를 셈
const count  = (arr) => arr.length;

const countWords = R.compose(count, explode);

countWords(str); //-> 19
```

함수의 서술부와 평가부를 분리

countWords(str)를 호출하면 explode 함수가 str을 인수로 받아 실행 후 결과(문자열 배열)를 count에 전달하고 이 함수는 배열 크기를 계산

- 합성은 함수 의 출력과 입력을 연결하여 진정한 함수 파이프라인을 완성
- 형식이 호환되는 함수를 경계선 부근에서 느슨하게 묶는 합성은 **인터페이스에 따른 프로그래밍**의 원리와 일맥상통
- 단순한 함수들을 조합해서 전체 프로그램을 구축
- **결합 가능한 연산** 부속품을 조립해서 만듦

#### 4.5.3 함수형 라이브러리로 합성

```js
const students = ['Rosser', 'Turing', 'Kleene', 'Church' ];
const grades = [80, 100, 90, 99];

const smartestStudent = R.compose(
    R.head, //첫 번째 원소를 얻음
    R.pluck(0), //해당 인덱스에 위치한 원소 추출, 학생 이름을 가리키도록
    R.reverse,  //전체배열을 뒤집어 첫 번째 원소가 최고 득점이 됨
    R.sortBy(R.prop(1)),    //오름차순 정렬
    R.zip   //인접한 배열 원소끼리 짝지어 새로운 배열 생성
);

smartestStudent(students, grades); //-> Turing
```

>알기 쉽게 함수 별칭 사용
```js
const first = R.head;
const getName = R.pluck(0);
const reverse = R.reverse;
const sortByGrade = R.sortBy(R.prop(1));
const combine = R.zip;

R.compose(first, getName, reverse, sortByGrade, combine);

//가독성은 좋아지지만 특정한 경우에만 사용 가능하므로 재사용성 측면에서 특별히 나아진게 없음
//head, pluck, zip같은 함수형 어휘를 숙지해서 포괄적인 지식을 습득하는 것이 좋음
```

#### 4.5.4 순수/불순 함수 다루기

>Before
```js
const showStudent =  compose(append, csv, findStudent);
```

>After 커링 및 합성을 응용
```js
//findObject :: DB -> String -> Object
const findObject = R.curry((db, id) => {
    const obj = find(db, id);
    if(obj === null){
        throw new Error(`ID가 [${id}]인 객체는 없습니다`);
    }
    return obj;
});

//findStudent :: String -> Student
//students 객체 저장소를 가리키게 하여 findObject를 부분 평가하면 findStudent라는 새 함수가 생성
const findStudent = findObject(DB('students'));

const csv = ({ssn, firstname, lastname}) =>
    `${ssn}, ${firstname}, ${lastname}`;

//append :: String -> String -> String
const append = R.curry((elementId, info) => {
    document.querySelector(elementId).innerHTML = info;
    return info;
});

//showStudent :: String -> Integer
//합성을 통해 전체 프로그램을 하나의 실행 가능한 단위로 엮음
const showStudent = R.compose(
    append('#student-info'),
    csv,
    findStudent,
    normalize,
    trim
);
showStudent('44444-4444'); //-> 444-44-4444, Alonzo, Church
```


#### 4.5.5 무인수 프로그래밍

compose 함수를 사용하면 인수를 선언할 필요가 전혀 없기 때문에 간결하면서 선언적인 **무인수** 코드 작성 가능

커링은 마지막 인수를 제외한 나머지 인수들을 유연하게 부분 정의하는 역할을 담당, **암묵적 프로그래밍** 코딩 스타일


### 4.6 함수 조합기로 제어 흐름을 관리

**함수 조헙기** : 함수 또는 다른 조합기 같은 기본 장치를 조합하여 제어 로직처럼 작동시킬 수 있는 고계함수

- 항등
- 탭
- 선택
- 순차열
- 포크 또는 조인
  
#### 4.6.1 항등(I-조합기)

- 주어진 인수와 똑같은 값을 반환
- 단순한 함수 결과에 대해 단언하고 싶을때..

```js
identity :: (a) -> a
```


#### 4.6.2 탭(K-조합기)
- 코드 추가 없이 공형 함수를 연결하여 합성할 때 유용
- 자신을 함수에 넘기고 자신을 돌려 받음
```js
tap :: (a -> *) -> a -> a
```

#### 4.6.3 선택(OR-조합기)

함수 호출 시 기본 응답을 제공하는 단순 조건 로직을 수행

```js
const alt = function (func1, func2) {
    return function(val) {
        return func1(val) || func2(val);
    }
};

//curry와 람다 표현식
const alt = R.curry((func1, func2, val) => func1(val) || func2(val));
```

#### 4.6.4 순차열(S-조합기)
- 함수 순차열을 순회, 2개 또는 더 많은 함수를 인수로 받아 동일한 값에 대해 각 함수를 차례로 실행하는 또 다른 함수를 반환
- 정해진 일을 하나씩 차례로 수행할 뿐 값을 반환하지는 않음
```js
const seq = function(/* func */) {
    const funcs = Array.prototype.slice.call(arguments);
    return function(val) {
        funcs.forEach(function(fn){
            fn(val);
        });
    };
};
```

#### 4.6.5 포크(조인) 조합기
- 하나의 자원을 두 가지 방법으로 처리 후 그 결과를 다시 조합
- 하나의 join 함수와 주어진 입력을 처리할 종단 함수 2개를 받음
- 분기된 각 함수의 결과는 제일 마지막에 인수 2개를 받는 join 함수에 전달됨

```js
const computeAverageGrade = 
    R.compose(getLetterGrade, fork(R.divide, R.sum, R.length));

computeAverageGrade([99, 80, 89]); //-> 'B'

// 점수 배열의 평균과 중앙값이 동일한지 비교하는 예제
const eqMedianAverage = fork(R.equals, R.median, R.mean);
eqMedianAverage([80, 90, 100])); //-> true
eqMedianAverage([81, 90, 100])); //-> false
```

조합기를 쓰면 자유롭게 무인수 프로그래밍이 가능, 다른 조합기와 재합성이 가능하고 복잡성을 줄일 수 있음

---

### week3 문제

- [map, filter, reduce](https://stackblitz.com/edit/quest3-map-filter-reduce)
- [toupperstring 못풀었어요ㅜㅜ](https://stackblitz.com/edit/quest3-toupperstring)

---

### week4 문제

>currying

```js
//아래처럼 동작하도록 renderHtmlTag 작성

renderDiv = renderHtmlTag('div')
renderH1 = renderHtmlTag('h1')

console.log(
  renderDiv('this is a really cool div'),
  renderH1('and this is an even cooler h1')
)
```
