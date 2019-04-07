# 함수형 최적화

## 함수 실행의 내부 작동 원리

- 자바스크립트에서 함수를 호출하면 그때마나 함수 콘텍스트 스택(context stack, call stack)에 레코드(프레임frame)가 생성된다.
- 콘텍스트 스택: 함수 실행과 클로저 변수를 관리하는 자바스크립트 프로그래밍 모델
- 초기 콘텍스트 스택에는 항상 '전역 콘텍스트'가 담겨있다.
- 함수 콘텍스트 프레임은 각각 내부 지역 변수의 개수만큼 메모리를 점유한다.
  - 지역변수가 하나도 없는 빈 프레임은 48바이트
  - 지역변수/매개변수는 8바이트
- 함수 본체에 변수를 많이 선언할수록 스택 프레임이 커진다.
- 각 프레임안에는 scopeChain, variableObject, this 이 세가지 정보를 가지고 있다.
  - scopeChain: 함수의 콘텍스트를 그 부모 실행 콘텍스트와 연결하거나 참조함.
  - variableObject: 지역변수와 함수는 물론 함수의 인수, 유사배열 객체 arguments를 가리킴. 스텍 프레임의 크기를 결정하는 요소가 된다.

- 스택의 주요 작동 규칙
  - 자바스크립트는 단일 스레드로 작동한다(동기실행 방식 synchronous execution)
  - 전역 콘텍스트는 하나만 존재함
  - 함수 콘텍스트 갯수에 제한이 없음 (클라이언트 측에서는 브라우저 메모리가 제한조건이 된다. 브라우저 메모리를 초과하는 경우 `maximum call stack size exceeded` 라는 에러를 뱉는다)
  - 함수를 호출할 때마다 실행 콘텍스트가 새로 생성되며, 자기 자신을 재귀 호출할 때에도 마찬가지이다.

이러한 함수 콘텍스트 스택을 잡아먹는 주요 원인은 '커링'과 '재귀'가 있다.

### 커링과 함수 콘텍스트 스택

커링을 사용하면 함수를 한번 매핑해서 사용한다는 장점이 있지만, 콜스택에 래핑하는 함수까지 고스란히 쌓인다는 단점이 있다. 지나치게 많이 커링함수를 래핑하면 성능에 치명적인 영향을 미칠 수 있다.

```javascript
// logger
const logger = function(appender, layout, name, level, message) {
  return log4js(appender, layout, name, level, message);
}

// logger 함수를 커링한다는 것은 결국 아래와 같이 호출한다는 것이다.
// 이 경우 (48 + 8) * 5 + 48(마지막 log4js) + a 까지 메모리를 점유하게 된다.
const logger = function(appender) {
  return function(layout) {
    return function(name) {
      return function(level) {
        return function(message) {
          return log4js(appender, layout, name, level, message);
        }
      }
    }
  }
}
```

### 재귀 코드의 문제점

다른 함수를 호출하는 것이 아닌, 자기 자신(함수)을 호출할 때에도 함수 콘텍스트 스택이 차곡차곡 쌓인다.

재귀 함수를 실행할 때, base case(기저 케이스)에 도달하지 못하는 잘못된 재귀 함수를 호출하는 경우 함수를 무한정으로 호출하게 되고, 결국 `Range Error: Maximum Call Stack Exceeded` 에러를 발생시키며 프로그램이 강제 종료된다.

기저 케이스가 존재하더라도, 지나치게 많은 횟수만큼 재귀호출을 하는 것도 에러를 일으킬 수 있다. (함수의 매개변수가 사이즈가 큰 배열인 경우, 무한루프가 아니더라도 충분히 메모리를 초과할 수 있다.

→ 원소가 많은 리스트를 순회하는 경우에는 재귀 호출을 사용하지 말고 map, filter, reduce등의 고계함수를 사용하도록 해야 함. 이런 함수를 사용하는 경우 함수 호출을 중첩하지 않고 반복할 때마다 스택을 재활용할 수 있다.

*?스택을 재활용..? 그냥 스택을 계속 만들었다 지웠다 해서 스택의 깊이가 깊어지지 않는다는 의미가 맞는 것 같다*

극단적으로 커링을 많이 하거나, 사이즈가 큰 배열을 매개변수로 받는(혹은 클로저로 가지는) 재귀함수를 지나치게 많은 횟수만큼 호출을 하는 경우가 아니라면, 메모리를 잡아먹더라도 커링을 통해 코드의 유연성과 재사용성을 높이고, 재귀 호출을 통해 쉬운 해법으로 문제를 해결하는 것이 좋은 방법이다(라고 저자는 생각한다)

함수형 프로그래밍에서는 콜스택에 쌓이는 함수의 갯수를 줄인다거나 하는 다른 패러다임에서 많이 사용되는 방식보다, 다른 패러다임으로는 불가능한 최적화(Lazy Function Evaluation)를 실행할 수 있다.

## 느긋한 평가로 실행을 늦춤

Lazy Function Evaluation(함수 표현식을 느긋하게 평가함): 가능한 한 오래, 의존하는 표현식이 호출될 때까지 미룬다.

자바스크립트는 기본적으로 eager evaluation이다.(조급한 평가. greedy evaluation 탐욕스런 평가 라고도 함) 함수의 결과값이 필요한지 따져보지 않고 변수에 바인딩되자마자 바로 표현식을 평가(eval)한다.  

```javascript
Maybe.of(student).getOrElse(createNewStudent());
```

위 코드를 자바스크립트가 실행하면, 자바스크립트는 '조급한 평가'를 하는것이 기본이기 때문에 student가 있는지 없는지 확인하지 않고 createNewStudent를 무조건 실행한다.

이를 '느긋한 평가'를 하도록 하려면 어떻게 해야 하나? → 불필요한 계산을 피하고, 함수형 라이브러리에서 단축 융합(shortcut fusion)을 사용한다.

### 대체 함수형 조합으로 계산을 회피

Javascript는 기본적으로 eager evaluation이기 때문에, 함수형 프로그래밍에서의 성능 최적화를 적용하고 싶다면 lazy evaluation처럼 동작하도록 흉내내는 것이 필요하다.

방법 → 함수를 레퍼런스(또는 이름)로 전달하고 조건에 따라 한 쪽만 호출하여 쓸데없는 계산을 건너뛰는 것.(조합기 alt를 생각하면 됨.  || (OR) 연산자로 연산자 앞에 위치한 수식을 먼저 확인한 후, 해당 수식이 true일 경우에만 뒤에 위치한 수식까지 확인한다.

```javascript
const alt = _.curry((func1, func2, val) => func1(val) || func2(val));

const showStudent = _.compose(
  append('#student-info'),
  alt(findStudent, createNewStudent)
);
showStudent('444-44-4444');

const student = findStudent('444-44-4444');
if (student !== null) {
  append('#student-info', student);
} else {
  append('#student-info', createNewStudent('444-44-4444'));
}
```

### 단축 융합을 활용

단축융합(shortcut fusion): 여러 함수를 실행하는 것을 하나로 병합하고, 중간 결과를 계산할 때 사용하는 내부 자료구조의 개수를 줄이는 함수 수준의 최적화. 이를 이용하면 그냥 호출하는 것보다 메모리를 덜 사용할 수 있다.

```javascript
import _ from 'lodash';
_.chain([p1, p2, p3, p4, p5, p6, p7])
  .filter(isValid)
  .map(_.property('address.country')).reduce(gatherStatus, {})
  .values()
  .sortBy('count')
  .reverse()
  .first() // 여기까지는 미리 정의하는 것. 실제로는 실행하지 않고 기다리다가...
  .value(); // 여기서 지금까지 서술한 애들을 전부 실행한다! (최적화해서!)
```

value()를 호출할 때 lodash.js가 내부적으로 단축융합 최적화를 수행하여 실행한다. 

위와 같은 것이 가능한 이유는, 참조 투명성에 관한 함수형 프로그램의 엄격한 규칙 덕분이다. 수학적 또는 대수적인 정합 관계(algebraic corresctness)가 성립하므로  compose(map(f), map(g)) 이를 map(compose(f, g)) 이렇게 변경하는 것이 가능하다. 이런식으로 수식을 간소화하듯 함수 호출을 간소화하고, 이를 통해 함수 호출 시 사용되는 자료구조의 갯수를 줄일 수 있다.

## '필요할 때 부르리'전략

반복적인 계산(특히 자원을 많이 소모하는 계산)을 피하는 것도 애플리케이션 실행 속도를 끌어올리는 방법이다. 이를 위해 기존의 객체지향 시스템에서는 캐싱을 이용하여 이 문제를 해결하곤 했다.

캐시(cache): 값비싼 연산(시간이 오래걸리거나 자원을 많이 소모하는)을 하기 전에 질의하는 중간 저장소 / 메모리이다.

그러나, 모든 함수가 캐싱을 하도록 만들면 오히려 코드가 더 복잡해질 수 있다(안그래도 되는 부분에서도 구태여 캐시를 확인하는 함수를 한번 호출해야 하므로). 또한 캐시를 이용하면 전역 공유 객체에 의존하는 사이드이펙트를 만들어낸다. 캐싱의 장점은 가져오되, 부작용은 배제한 방법이 '메모화(memoization)'이다.

### 메모화

메모화에서 이용하는 캐시 전략은 기존 캐시 전략과 동일하다.

- 해당 함수 인수로 키값을 만듦
- 계산결과를 '값'으로 취급하여 키(인수) - 값(계산결과) 쌍을 저장한다.
- 하나의 '키'에 하나의 '값'만 가질 수 있다는 것은, 함수형 프로그래밍의 참조투명성 덕분에 가능하다.

### 계산량이 많은 함수를 메모화

순수 함수형 언어는 자동으로 메모화를 실천하지만, 자바스크립트나 파이썬 같은 언어에서는 메모화 시점을 선택할 수 있다.

계산 집약적인 함수의 경우 캐시 계층을 엮어놓는 것으로 큰 효과를 볼 수 있다. (ex: 문자열을 ROT13형식으로 인코딩하는 함수의 경우 동일입력 - 동일출력, 즉 참조투명하므로 메모화를 이용하여 성능을 향상시킬 수 있다.)

```javascript
var rot13 = s => {
  return s.replace(/[a-zA-Z]/g, c =>  {
    return String.fromCharCode(
      (c <= 'Z' 90 : 122) >= (c = c.charCodeAt(0) + 13) ?
      c :
      c - 26
    )
  });
};

var rot13 = rot13.memoize(); // 이와 같은 방법으로 메모이제이션을 구현하거나, 아래와 같은 방법을 사용할 수도 있다.

var rot13 = (s => 
  s.replace(/[a-zA-Z]/g, c =>
    String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ?
      c :
      c - 26
    )
  )).memoize();
```

메모이제이션을 하는 경우, 동일한 입력으로 함수를 재호출할 때 내부 캐시가 히트되어 즉시 결과가 반환됨.

ex) 자바스크립트의 고정밀 시각(High Resolution Time) API(성능Performance API라고도 함)

```javascript
const start = () => now();
const runs = [];
const end = function(start) {
  let end = now();
  let result = (end - start).toFixed(3);
  runs.push(result);
  return result;
};

const test = function(fn, input) {
  return () => fn(input);
};

const testRot13 = IO.from(start)
  .map(R.tap(test(rot13, 'functional_js_50_off')))
  .map(end);

testRot13.run();// first time 0.733m
testRot13.run(); // second time: 0.021ms rot13함수가 memoize가 되었기때문에 두번째 호출시에는 첫번째 호출시보다 훨씬 빠르다.
assert.ok(runs[0] >= runs[1]);
```

```javascript
Function.prototype.memoized = function() {
  let key = JSON.stringify(arguments);
  this._cache = this.cache || {};
  this._cache[key] = this._cache[key] || this.apply(this, arguments);
  return this._cache[key];
}

Function.prototype.memoize = function() {
  let fn = this;
  if (fn.length === 0 || fn.length > 1) {
    return fn;
  }
  return function() {
    return fn.memoized.apply(fn, arguments);
  }
}
```

function 객체를 확장하여 어디서건 메모화 기능을 쓸 수 있으며, 전역 공유 캐시에 접근하지 않아도 됨(side effect가 사라짐)

단항함수의 메모화는 단순하지만, 다항함수의 메모화는 매우 어렵다. 때문에, '커링'을 사용함.

### 커링과 메모화를 활용

캐시 계층에서 추가적인 오버헤드가 생기는 것을 막으려면, 키 생성 연산이 단순해야 하는데, 다항함수는 키를 생성하는 것이 복잡하다. → 커링을 이용하여 단항함수로 만들고, 그 함수를 메모화하는 것이 좋다.

### 분해하여 메모화를 극대화

문제를 메모화 가능한 함수로 잘게 나눌수록 메모화 효과가 커진다. 쪼갠 각각의 함수들이 메모화를 하여 내부에 캐시 장치가 있는 것처럼 행동하기 때문! *(a, b, c 동작이 합해진 d 하나만 캐싱하는 것보다 a, b, c, 그리고 전체 함수인 d까지 캐싱하는 것이 훨씬 빠르겠지 당연히!)*

### 재귀 호출에도 메모화를 적용

재귀 함수를 잘못 호출하여 정해진 스택을 초과하거나 하는 문제를 메모화를 이용하여 해결할 수 있다.

재귀호출은 기저 케이스에 도달할 때까지 '같은 문제', 즉 큰 문제의 하위 문제들을 풀어, 결국 마지막에 스택이 풀리며 최종 결과를 낸다. 이때, 하위 문제의 결과를 캐시한다면 같은 함수를 호출할 때 성능을 끌어올릴 수 있다.

```javascript
const factorial = ((n) => (n === 0 ? 1 : (n * factorial(n-1)))).memoize();
factorial(100);
factorial(101); // 이때, 이전에 계산되었던 factorial(100)가 활용된다.
```

메모화를 통해 함수 호출 스택이 지저분해 지는 것을 방지할 수 있다. 또한 애초에 쌓아올리는 스택 프레임의 갯수를 줄일 수 있다.

## 재귀와 꼬리 호출 최적화

### 재귀 호출 최적화 기법

- 메모화(memoization)
- 꼬리호출 최적화(컴파일러 수준의 장치를 응용하여 성능을 끌어올림)



### 비꼬리 호출을 꼬리 호출로 전환