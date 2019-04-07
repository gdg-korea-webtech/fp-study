# 6장. 함수형 프로그래밍과 단위 테스트

함수형 프로그래밍은 그 자체로도 테스트하기 좋은 프로그래밍 페러다임입니다.

## 6-1. 함수형 프로그래밍과 단위 테스트

- 일반적으로 테스트는 단위 테스트 / 통합 테스트 / 인수 테스트로 구분된다.
- FP의 영향력은 단위 테스트를 할 때 가장 빛을 발한다.



## 6-2. 명령형 프로그램 테스트의 어려움

- 명령형 코드는 전역 상태와 변이에 의존하기 때문에 테스트 하기 어렵다.
- 단위 테스트 설계의 가장 중요한 원칙은 **격리** 이므로 단위 테스트는 다른 데이터나 주변 테스트에 상관 없이 실행될 수 있어야 하는데, 명령형 프로그램은 그것이 쉽지 않다.

### 6.2.1. 작업을 식별하고 분해하기 어렵다.

- 단위 테스트는 설계상 애플리케이션의 가장 작은 부분을 테스트 한다.
- 따라서 애초에 분할을 감안하지 않고 설계한 명령형 프로그램은 테스트 단위를 나누기 쉽지 않다.
- 함수의 테스트 가능 범위를 넓히려면, 순수한 부분과 불순한 부분이 구분된, 느슨하게 결합된 컴포넌트로 함수를 나눌 방법을 궁리해야 한다.

### 6.2.2 공유 자원에 의존하면 들쭉날쭉한 결과가 나옴.

- 부수효과를 지닌 함수는 평가 순서에 따라 오류가 발생할 수 있다.

### 6.2.3 평가 순서를 미리 정해야 함.

- 단위 테스트는 실행 순서를 바꿔도 결과가 달라져서는 안된다.
- 불순한 함수 (함수형 패러다임을 사용하지 않은 함수)는 이러한 조건을 지키기가 쉽지 않다.
- 처음부터 함수형으로 코드를 작성하면 이러한 고민에서 자유로울 수 있다.



## 6-3. 함수형 코드를 테스트하기

### 6.3.1 함수를 블랙박스처럼 취급

- 함수형 프로그래밍에서는 애플리케이션의 다른 부분에 구애받지 않고, 느슨하게 입력값을 결합하는 함수를 독립적으로 작성.
- 이는 함수를 블랙박스로 취급하고 주어진 입력에 맞는 출력을 내는지만 집중해서 보자는 생각

### 6.3.2 제어 흐름 대신 비즈니스 로직에 집중

- 특정 작업을 단순한 함수로 분해하는 것이 중요.
- 이렇게 하면 주요 프로그램 로직을 형성하는 개별 함수 테스트하는 일에 집중할 수 있다.

### 6.3.3 모나드 격리를 통해 순수/불순 코드 분리

- 함수형 패러다임을 지키려고 노력해도 코드를 짜며 불순한 함수가 많은 것은 어쩔 수 없는 일이다.

  - e.g.) DOM 상호작용 / 서버 측에서의 DB,파일 데이터 IO

- showStudent의 함수형 버전

  ```javascript
  const showStudent = R.compose(
  	map(append('#student-info')),
      liftIO,
      getOrElse('student not found'),
      map(csv),
      map(R.props(['ssn','firstname','lastname'])),
      chain(findStudent),
      chain(checkLengthSsn),
      lift(cleanInput)
  );
  ```

  - 이처럼 명령형 함수를 잘게 나눈 후 합성 및 모나드를 이용해 재조립 함을 알 수 있다.

- 위의 예제 코드를 기반으로 보았을 때, 순수함수 / 불순함수를 나누어보자면 다음과 같다.

  - **순수함수**
    - cleanInput
    - checkLengthSsn
    - csv
  - **불순함수**
    - findStudent (하지만 테스트 가능)
    - append (신뢰성 있는 테스트 불가)



### 6.3.4 외부 디펜던시를 mocking

- 여기서 잠깐! mock에 대해 알아보고 가자~~~~

----

### Mock

- **Mock이란? (모의 객체)**

  - 실제 객체를 만들기엔 비용과 시간이 많이 들거나 의존성이 길게 걸쳐져 있어 제대로 구현하기 어려울 경우, 가짜 객체를 만들어 사용하는데 이 것을 `mock` 이라고 한다.

- **Mock 객체는 언제 필요한가?**

  - 테스트 작성을 위한 환경 구축이 어려운 경우
    - 환경 구축을 위한 작업 시간이 많이 필요한 경우에 Mock객체를 사용한다. (데이터베이스, 웹서버, 웹애플리케이션서버, FTP서버, 등)
    - 특정 모듈을 갖고 있지 않아서 테스트 환경을 구축하지 못할 때 또는 타 부서와의 협의나 정책이 필요한 경우에 사용한다.
  - 테스트가 특정 경우나 순간에 의존적인 경우
  - 테스트 시간이 오래 걸리는 경우
  - 개인 PC의 성능이나 서버의 성능문제로 오래 걸릴수 있는 경우 시간을 단축하기 위해 사용한다.

- **Mock의 종류**

  - **1. 더미 객체**

    - 단순히 인스턴스화될 수 있는 수준으로만 객체를 구현한다.
    - 인스턴스화된 객체가 필요할 뿐 해당 객체의 기능까지는 필요하지 않은 경우에 사용한다.

  - **2. 스텁(Stub)**

    - 더미 객체 보다 좀더 구현된 객체로 더미 객체가 마치 실제로 동작하는 것처럼 보이게 단들어 놓은 객체이다.
    - 객체의 특정 상태를 가정해서 만들어 특정 값을 리턴해 주거나 특정 메시지를 출력해 주는 작업을 한다.
    - 특정 상태를 가정해서 하드코딩된 형태이기 때문에 로직에 따른 값의 변경은 테스트 할 수 없다.
    - e.g. )

    ```javascript
    const stub_cancel = sandbox.stub(PaymentService, 'cancelPayment');
    stub_cancel.throws(new Error('invalid call')); // 오류 발생 시
    stub_cancel.withArgs('nicepay00m12345678', 12000, 'cancel reason', false)
      .resolves('ResultCode=2001|ResultMsg=취소성공');
    ```

  - **3.스파이 (Spy)**

    - 테스트에 사용되는 객체, 메소드의 **사용 여부 및 정상 호출 여부**를 기록하고 요청시 알려준다.
    - 특정 메소드가 호출 되었을 때 또 다른 메서드가 실행이 되어야 한다와 같은 행위 기반 테스트가 필요한 경우 사용한다.

---

- Mock은 기대식을 충족하지 않을 경우 테스트를 불합격 처리하며, 우리가 작성한 함수와 상호작용하는 객체가 해야할 일을 미리 여기에 정의한다.
- 그렇게 하면 외부 자원을 의도대로 테스팅하고 조정할 수 있어 테스팅에 용이하다.
- 이 책에서는 Sinon.js라는 모듈을 사용한다.



## 6.4 속성 기반 테스트로 명세 담기

- 단위 테스트는 함수의 런타임 명세를 담고 문서화하는 용도로 쓸 수 있다. (테스트가 중요한 이유 중에 가장 큰 이유라고 생각합니다!!!!)

  ```javascript
  Qunit.test('평균 학점을 계산한다.', (assert) => {
      assert.equal(computeAverageGrade([80,90,100], 'A'));
      assert.equal(computeAverageGrade([80,85,89], 'B'));
      ...
  });
  ```

- 이것만 보고도 다음과 같이 함수 요건을 간단히 문서화 할 수 있다.

  - 학생의 평균 성적이 90점 이상이면 A학점
  - 80~89점이면 B학점
  - ...

### 속성 기반 테스트

- 단위 테스트는 입력값과 그에 따른 기댓값을 손수 나열해서, 작성한 함수가 정상 작동하는지를 확인한다. 특정 기능을 잘 테스트하기 위해 잘 작동할 안전한 입력값도 넣고, 또 오류가 발생할 것 같은 경계에 있어 보이는 위험한 입력값을 적기도 한다.

- 하지만 속성 기반 테스트는 작성한 함수의 속성만을 지정하고, 그 실제 입력값은 테스팅 도구가 임의로 자동 생성해서 확인한다.

  - e.g.) 배열을 정렬하는 함수
    - **단위테스트**의 경우
      - 빈 배열을 정렬한 결과는 빈 배열이어야 한다.
      - [1]을 정렬한 결과는 [1]이어야 한다.
      - [2 1 3 0]를 정렬하면 [0 1 2 3]이 된다.
    - **속성테스트**의 경우
      - 임의의 배열을 정렬하면, 매 인접 두 아이템은 앞의 아이템이 뒤의 아이템보다 작거나 같아야한다.
      - 임의의 배열을 정렬을 한번 한 결과와, 여러번 한 결과는 같다.

- 많은 무작위 테스트 케이스를 만들고, 함수의 모든 가능한 출력 경로를 체크해봄으로써 함수를 검증하자는 것.


### 코드 실행률로 효율 측정 (Code Coverage)

- 코드 실행률은 비록 품질 지표는 아니지만, 함수를 테스트한 정도를 표시하므로 품질 향상과 연관이 있다.

- 코드 실행률은 프로그램을 단위 테스트 했을 때 실제로 실행된 코드 라인 수의 비율(%)로 측정


### Reference

[편리하고 강력한 속성 기반 테스팅으로 더 탄탄한 코드를!](https://medium.com/happyprogrammer-in-jeju/%ED%8E%B8%EB%A6%AC%ED%95%98%EA%B3%A0-%EA%B0%95%EB%A0%A5%ED%95%9C-%EC%86%8D%EC%84%B1-%EA%B8%B0%EB%B0%98-%ED%85%8C%EC%8A%A4%ED%8C%85-b405ab54fd3c)



### 과제

- 지금까지 짰던 숙제 코드 중 하나를 테스트 코드로 작성해보자.
- lodash api 중 하나를 속성 기반 테스트로 작성해보자.