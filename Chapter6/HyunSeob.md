# 6. 빈틈없는 코드 만들기

- 함수형 프로그래밍도 마찬가지로 테스트 코드를 작성해서 의도한 대로 움직이는 지 알아봐야 한다.
- 명령형 프로그램은 사이드 이펙트가 있기 때문에 상태를 넘겨 짚어야 되고, 일관된 결과를 보장받기 어렵기 때문에 테스트 하기 어렵다.
- 함수형 코드는 그 자체로도 테스트하기가 좋다.

# 6.1 함수형 프로그래밍과 단위 테스트

- 일반적으로 테스트는 Unit Test, Integration Test, Acceptance Test, 세가지로 분류한다.
- 함수형 프로그래밍의 영향력은 단위 테스트에서 가장 강력하다.
- 인수 테스트도 중요하지만, 이건 함수형으로 작성했는지, 명령형으로 작성했는지에는 무관하다.

# 6.2 명령형 프로그램 테스트의 어려움

- 명령형 코드는 전역상태와 변이에 의존하기 때문에 테스트하기가 정말 어렵다.
- 단위 테스트 주요 원칙 중에 하나는 격리이다. 다른 데이터나 주변 테스트에 상관없이 실행되어야 한다.

## 6.2.1 작업을 식별하고 분해하기 어려움

- 단위 테스트는 어플리케이션의 가장 작은 부분을 테스트하는 것이다.
- 거대한 모놀리틱 프로그램에서는 모듈 단위를 식별하기가 어렵다.
- 명령형 프로그램에서는 주로 관심사가 제각각인 비즈니스 로직이 섞여있다. 따라서 테스트하기가 어렵다.
- 함수 테스트 범위를 넓히려면 순수한 부분과 불순한 부분이 구분되고 느슨하게 함수를 나눠야 한다.

## 6.2.2 공유 자원에 의존하면 들쭉날쭉한 결과가 나옴

- 안정된 테스트는 나머지 다른 테스트와 독립적으로 돌아가야 한다.
- 각 테스트는 샌드박스에서 작동해야 하고, 시스템 상태는 테스트 실행 전 상태로 유지되어야 한다.

## 6.2.3 평가 순서를 미리 정해야 함

- 단위 테스트는 결합적이어야 한다.
- = 실행 순서를 바꿔도 결과는 같아야 한다.
- 하지만 불순한 함수는 이 원칙이 통하지 않는다.
- 그래서 테스트 러너들은 보통 테스트를 구성하고 정리하는 도구를 제공한다.
- 전역 컨텍스트를 조작해서 성공하는 테스트는 테스트 순서만 바뀌어도 쉽게 실패할 수 있다.

# 6.3 함수형 코드를 테스트

- 명령형이든 함수형이든 단위 테스트를 개발하기 위해서 취해야 하는 지침은 대부분 같다.
- 하지만 함수형 프로그래밍은 본질적으로 테스트를 위해서 따라야 하는 지침과 잘 맞기 때문에 더 테스트하기 쉽다.

## 6.3.1 함수를 블랙박스처럼 취급

- 함수형 프로그래밍에서는 어플리케이션의 다른 부분에 구애받지 않도록 함수를 독립적으로 작성한다.
- 때문에 결과가 동일한, 예측 가능한 테스트를 작성할 수 있다.
- 모든 매개변수를 함수에 명시하면, 함수 실행 시점에 감추는게 없어지므로 테스트도 단순해진다.

## 6.3.2 제어 흐름 대신 비즈니스 로직에 집중

- 함수형 코드 개발 시 시간이 가장 오래 걸리는 문제를 나누는 일이다.
- 함수 조합기를 사용하면 설계와 분해과정에 쏟은 시간을 테스트 단계에서 돌려받을 수 있다.
- 왜냐면 모든 함수가 순수하게 짜여져 있을거라고 가정한다면, 유닛 테스트 결과가 안전하다면 통합 테스트 결과도 안전하다고 추정할 수 있기 때문!
  - 개인적으로는 이 말이 맞는건지.. 의문.

## 6.3.3 모나드 격리를 통해 순수/불순 코드를 분리

- 프로그램은 대부분 순수한 부분과 불순한 부분을 갖고 있다.
- 함수형 프로그램에서 사이드 이펙트를 유발하는 작업은 최소한의 함수에 국한되므로 테스트 가능한 영역이 늘어난다.

## 6.3.4 외부 디펜던시를 모킹

- 모킹은 함수의 외부 디펜던시를 제어 가능한 방향으로 모방하는데 쓰인다.
- 또한 프로그래밍 가능하다.
- 외부 자원을 마음대로 조정할 수 있어서 예측 가능하다.
- 모의 컨텍스트를 이용하면 몇 번 호출 했는지, 어떤 인수를 받았는지, 어떤 값을 반환했는지 등의 기대동작을 지정할 수 있다.
- 함수형 코드가 명령형 코드보다 테스트성이 압도적으로 좋은 이유는 참조 투명성 때문이다.
- 단언(assert)은 그 자체로 참조투명성이 유효한지 검증하는 행위다.

# 6.4 속성 기반 테스트로 명세 담기

- 단위 테스트는 함수의 명세를 문서화하는 용도로도 쓸 수 있다.
- 훌륭한 명세는 특정 사례에 기반을 두지 않는다. 일반적이고 보편적이어야 좋은 명세다.
- 보편적인 명세는 어느 특정 시점의 상태에 의존하지 않으므로 다루기가 수월하다.
- 속성기반 테스트는 함수에 어떤 입력을 넣으면 어떤 출력이 나와야 맞는지 성명?? 한다.
- 속성기반 테스트는 무작위로 테스트케이스를 만들고 함수의 출력경로를 빠짐 없이 체크해 함수의 속성을 검증하는 것이다.
- JSCheck라는 라이브러리는 속성기반 테스트를 수행한다.
- JSCheck의 핵심은 주장과 결론을 만드는 것이다.

JSCheck만 강조하기는 하는데.. 요즘엔 안쓰는 것 같고 필요하면 아래 것들을 고려해볼 수 있음

[https://github.com/leebyron/testcheck-js](https://github.com/leebyron/testcheck-js)

[https://github.com/dubzzz/fast-check](https://github.com/dubzzz/fast-check)

[https://github.com/jsverify/jsverify](https://github.com/jsverify/jsverify)

근데 셋다 별로 잘 쓰이지는 않는걸 보면... property based testing이 의미 있나 싶긴하다.

# 6.5 코드 실행률로 효율 측정

- 단위 테스트의 효율은 코드 실행률(코드 커버리지)와 마찬가지다.
- 이 정보를 얻으려면 모든 실행 경로를 탐색해야 한다.
- 코드 커버리지는 분명 품질 향상과 연관이 있다.
- 테스트가 되지 않는 부분은 보통 에러처리 코드들이다.
- 보통 코드 커버리지는 실행되는 코드 라인 수의 비율로 측정 가능하다.
- 이는 Blanket.js로 계산가능하나.. Jest로도 할 수 있음

## 6.5.1 함수형 코드 테스트의 효율 측정

- 명령형 코드에서는 에러 처리 로직이 테스트 되기 어렵다.
- 하지만 함수형 코드에서는 모나드가 빈 값 개념을 전파하기 때문에(?) 모든 함수가 실행되므로 비슷한 코드라도 코드 커버리지가 100%에 가까워 진다.

### 입력이 잘못된 경우, 명령형/함수형 코드의 효율 측정

- 명령형 코드에서는 정상 실행 로직을 거의 모조리 건너뛰게 되어 커버리지가 매우 낮아진다.
- 함수형 코드에서는 잘못된 값이 넘어와도 전체 코드를 무작정 건너뛰지는 않는다.

## 6.5.2 함수형 코드의 복잡도 측정

- 프로그램의 복잡도를 측정하기 위해서는 제어 흐름을 들여다 봐야 한다.
- 함수형 프로그램은 코드를 선언적 형태로 표현하므로 눈에 잘 들어온다.
- = 복잡도가 줄어든다.
- 알고리즘 관점에서도 함수형 코드는 덜 복잡한 코드다.
- `if-else` 블록을 많이 쓴 코드는 따라가기가 어렵다.
- 이런 블록이 늘어날 수록 테스트하기가 어려워지므로, 함수를 단순하게 유지하는 것이 중요하다.
- FP는 함수를 단순하게 축약하고, 합성과 모나드로 조합해서 쓰자는 것이다.
- 순환 복잡도는 함수의 경로 개수를 측정하기 위한 정량 지표다.
- 어떤 함수를 통과하는 모든 경로를 테스트하려면 그 함수의 경계조건을 확인하면 된다는 발상에서 비롯되었다.
- 조건 블록은 프로그램의 제어 흐름을 두 갈래의 선형 독립적 경로로 분할하므로 복잡도를 가장 높이는 요인이다.
- 함수형 프로그래밍에서는 제어흐름을 사용하지 않고 추상화 장치를 많이 쓰므로 측정이 간단하다.
- 그리고, 노드와 간선이 줄기 때문에 모든 경로가 선형 독립적으로 바뀐다.

# 오늘의 문제

## Hard version

- 저번 시간 문제였던 모나드 리팩토링에 그대로 테스트를 씌워봅시다.
- `jest`를 사용합니다.

[Jest · 🃏 Delightful JavaScript Testing](https://jestjs.io/)

- 가능한 다양한 테스트 케이스를 모두 테스트하기 위해 노력해봅시다.
- 테스트 커버리지를 측정합니다. 목표는 100%!
- 프로퍼티 베이스드 테스트를 추가해봅시다.
- 콘솔 모킹은 이런게 있네요

[jest-mock-console](https://www.npmjs.com/package/jest-mock-console)

- DOM 모킹은 DOM testing library를 사용해봅시다.

[DOM Testing Library · Simple and complete DOM testing utilities that encourage good testing practices](https://testing-library.com/)

---

## Easy version

- 2주차 문제였던 `makeHttpClient` 의 테스트 케이스를 작성해봅시다.
- 나머지는 Hard version과 동일