# 빈틈없는 코드 만들기

## 함수형 프로그래밍과 단위 테스트

테스트에는 *인수테스트(acceptance test)*, *통합테스트(integration test)*, *단위테스트(unit text)* 가 있는데, 이중 코드와 관련이 있는 것은 통합테스트, 단위테스트 두가지이다. 함수형으로 짠 프로그램은 이 두가지 테스트를 수행하기에 명령형 코드보다 훨씬 쉽다.

기본적으로 **테스트코드**는 어떤 함수가 정상적인 결과를 반환하는지 확인하는 방식인데, 함수형 코드는 이미 **순수한**, **참조 투명한** 함수이기 때문에 동일한 파라미터를 집어넣으면 항상 동일한 결과가 나온다는 것이 자명하기 때문에 테스트가 쉽다. 반면, 명령형 코드는 다른 전역 객체의 상태에 따라서 해당 함수의 결과값이 다르게 도출될 수 있기 때문에 테스트하기 어렵다.

## 명령형 프로그램 테스트의 어려움

명령형 코드는 전역 상태와 변이에 의존하기 때문에 테스트하기 어렵다.

### 작업을 식별하고 분해하기 어려움

애초에 분할을 감안하여 설계한 것이 아닌 코드의 경우 어디서 어디까지 잘라서 테스트를 해야 할 지 '모듈 단위(unit of modularity)'를 식별하기 어렵다.
이런 코드를 테스트하려면, 함수형으로 코드를 작성해야 함(순수/불순 함수 분리, 느슨한 결합)

### 공유 자원에 의존하여 일관된 결과를 기대하기 어렵다(공유 자원에 의존하면 들쭉날쭉한 결과가 나옴)

각 단위테스트는 다른 테스트와 상관없이 실행되어야 하는데(**sandbox**), 만약 함수 헤더에 정의되어 있지 않은 다른 전역 객체를 사용하는 함수를 작성했다면, 그 작업을 언제 실행했는지, 몇번 실행했는지에 따라 같은 매개변수를 넣어 실행한 함수이더라도 결과가 다르게 나올 수 있다.

### 코드를 수행한 순서에 따라 결과값이 달라진다. (평가 순서를 미리 정해야 함)

앞과 비슷한 내용

## 함수형 코드를 테스트 - 함수형 코드를 테스트할 때의 이점

단위테스트를 하기 좋은 코드를 짜는 방법과, 함수형 프로그래밍 기법이 상당히 비슷하다.

### 함수를 블랙박스처럼 취급

함수형 프로그래밍에서 권장하는 대로 참조투명성이 보장되는(함수 내에서 사용하는 자원을 모두 매개변수로 받음)함수를 작성하면, 순서와 실행횟수에 관계 없이 항상 동일한 결과를 기대할 수 있다.

### 제어 흐름 대신 비즈니스 로직에 집중

로직을 잘게 쪼갠 뒤 라이브러리에서 제공하는 작은 함수들을 조합 및 합성하여 새로운 함수를 만드는 경우, (제어 흐름을 주로 담당하는)라이브러리 함수는 테스트할 필요가 없고, 결과로 나온 함수 및 자신이 커스텀하게 구현한, 조합에 이용되는 함수 몇가지를 테스트하면 된다. 모든 내용을 전부 테스트하는게 아니라, 자신이 만든 부분만 테스트하면 된다.

### 모나드 격리를 통해 순수/불순 코드를 분리

IO 등 불순한 로직과 묶여있는 큰 함수를 그대로 테스트하려고 한다면, IO와 연관된 부분의 테스트가 어렵다. 모나드를 통해 순수함수와 불순함수(IO)를 분리시키면 나머지 순수함수 부분은 테스트가 가능하다.

명령형 코드 에서는 IO 때문에 해당 함수 전체의 테스트를 포기해야 했거나, 혹은 매우 비효율적인(테스트 순서를 바꾸면 테스트를 실패할 수도 있는, 작성하나마나 한 테스트코드) 테스트코드를 작성해야 해야 했다.

함수형으로 코드를 작성하여(모나드 이용) IO를 제외한 나머지를 테스트 가능하게 만들면 IO 부분만 테스트에서 제외하고 나머지 코드를 정상적으로 테스트할 수 있다.

### 외부 디펜던시를 모킹(모의)

**mocking**: 가상으로 테스트에 필요한 것을 만들어두고 참조하도록 하는것)

모킹(mocking)는 함수의 외부 디펜던시를 제어/단언 가능한 방향으로 모방하는데 많이 쓰인다.

`sinon.js`를 이용하여 DB, Server 등과 관련된 mock객체를 만들고 그것을 가지고 테스트를 할 수 있다. (`jest`는 sinon.js없이 쓸 수 있다)

```javascript
const studentStore = DB('student');
// test with jest
test('[showStudent]: showStudent는 null을 반환함', () => {
  // studentStore 함수내부에 있는 find라는 함수가 한번 호출되었을 때 null을 반환하도록 mock 함수 만듦.
  studentStore.find = jest.fn(() => null);

  // safeFetchRecord 함수를 테스트한다.
  const findStudent = safeFetchRecord(studentStore);

  // verify result
  expect(findStudent('111-22-3333').isLeft).toBe(true);

  // verify mock function
  expect(studentStore.find.mock.calls.length).toBe(1);
  expect(studentStore.find.mock.results[0].value).toBe(null);
});

test('[showStudent]: showStudent는 올바른 객체를 반환함', () => {
  // studentStore 함수내부에 있는 find라는 함수가 한번 호출되었을 때 객체를 반환하도록 mock 함수 만듦.
  studentStore.find = jest.fn(() => new Student('Alonzo', 'Church', 'Princeton').setSsn('111-22-3333'));

  // safeFetchRecord 함수를 테스트한다.
  const findStudent = safeFetchRecord(studentStore);

  // verify result
  expect(findStudent('111-22-3333').isLeft).toBe(true);

  // verify mock function
  expect(studentStore.find.mock.calls.length).toBe(1);
  expect(studentStore.find.mock.results[0].value).any(Student);
});
```

## 속성 기반 테스트로 명세 담기

**속성 기반 테스트(property-based testing)**: 함수의 매개변수와 반환값에 대하여 참조 투명한 명세를 작성해놓으면, 그 조건 안에서 무작위로 조건을 만족하는 케이스를 생성하여 테스트하는 것. JSCheck를 이용해볼 수 있다.  jscheck를 이용해서 실행한 결과는 보고서로 나옴.

```javascript
// jest + jscheck
const JSC = import ('./jscheck');

test('학점계산', () => {
  JSC.clear();
  JSC.on_report((str) => console.log(str));
  JSC.on_pass((object) => expect(object.pass).toBe(true));
  JSC.on_fail(
    (object) => expect(object.pass).toBe(false) ||
    expect(object.args.length).toBe(11)
  );

  JSC.test(
    '평균학점계산', // test name
    function(verdict, grades, grade) {// 판별함수, 매개변수, 결과
      return verdict(computeAverageGrade(grades) === grade);
    },
    [ // grades 배열의 최대 길이, 90에서 100 사이의 값이면 'A'
      JSC.array(JSC.integer(20), JSC.number(90, 100)),
      'A',
    ],
    function(grades, grade) { // verdict 함수(판별함수)
      return '평균 ' + grade + '학점에 관한 테스트: ' + grades;
    }
  );
});
```

속성 기반 테스트는 함수의 모든 가능성을 최대한 이끌어내는 강력한 기법이다.

코드가 정말 참조 투명한지 여부를 자동화된 사례로 확인 가능함. 효율적인 단위테스트 가능
자동화하는 것을 통해 '코드 효율'도 측정 가능하다(다음내용)

## 코드 실행률(code coverage)로 효율 측정

`코드 실행률 = (개발해놓은 코드 중 테스트코드를 거쳐가며 실행된 코드 / 전체 코드) * 100;`

코드 실행률을 분석하면 테스트 안된 부분이 어디인지 찾을 수 있다.

`Blanket.js`를 이용하여 측정 가능함.

함수형 코드는 에러처리부분 부분에서도 모나드를 이용하여 모든 코드가 실행이 되므로 코드 커버리지가 (100% ~ 80%)가 나오도록 할 수 있지만, 명령형 코드는 경우에 따라 코드 커버리지가 80%에서 낮게는 40%까지 떨어짐.

테스트코드 실행 시 code coverage가 낮다는 것은 테스트 코드를 거치지 않고 지나가는 코드가 많다는 의미로, 테스트하지 못한 코드가 나중에 문제를 일으킬 수 도 있다는 의미가 될 수 있다.

## 함수형 코드의 복잡도 측정

제어/반복문이 많이 중첩되면 코드를 따라가기가 어렵다. => 가능한 한 함수를 단순 람다 표현식으로 축약하고, 합성과 모나드로 조합해서 사용하자는 것이 FP의 요점.

**순환 복잡도(cc: cyclomatic complexity)**: 함수의 선형 독립적인 경로의 개수를 측정하기 위한 정량적인 소프트웨어 지표.

더이상 나눌 수 없는 코드블록을 **노드**라고 하고, 그 노드들을 제어/반복에 따라 연결한 화살표를 방향성 있는(directed) **간선**이라고 한다.

순환복잡도(M) = (간선 개수: E) - (노드나 블록의 개수: N) + (출구 있는 노드의 개수 :P)

조건 블록(if-else)은 프로그램의 제어 흐름을 두 갈래의 선형 독립적 경로로 분할하기 때문에 가장 복잡도를 높이는 요인이다. 제어장치가 많을 수록 순환복잡도가 커지고 프로그램 테스트가 더 어려워진다.

함수형 프로그램은 조건문이나 루프를 고계함수, 함수조합기 등의 추상화 장치를 이용하여 숨기기 때문에 순환 복잡도가 대부분 1에 가까운 값이 나온다.

이 외에도 여러가지 성능 지표를 확인해보면, 명령형 코드에 비해 함수형 코드가 월등하게 높다.

---

[chapter5 과제](https://stackblitz.com/edit/js-validation-r2f5sd)

---

[chapter6 과제]()