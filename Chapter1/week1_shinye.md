## 함수형 프로그래밍의 목적

- 변경 가능한 상태를 불변상태(Immutab)로 만들어 SideEffect를 없애자.
- 모든 것은 객체이다.
- 코드를 간결하게 하고 가독성을 높여 구현할 로직에 집중 시키자.
- 동시성 작업을 보다 쉽게 안전하게 구현 하자.

## 함수형 프로그래밍의 특징

-  선언적 프로그래밍
    - 프로그램이 _어떤 방법으로_ 해야 하는지를 나타내기보다 _무엇_과 같은지를 설명하는 경우에 "선언형"이라고 한다.
    - 선언형 프로그램에서는 그 언어의 표준 알고리즘으로 처리되는 자료 구조를 작성하거나 선언한다. 예를 들어서 웹페이지를 작성한다고 하면, 페이지가  [HTML](https://ko.wikipedia.org/wiki/HTML "HTML")에서 무엇을 보여주어야 하는지를 선언하고 브라우저의 절차적 알고리즘이 이것을 화면에 표시할 점들로 변환한다.
    - 선언형 언어는 다른 언어와 같이 문법을 가지고 있고 언어의 단어들이 어떻게 결합되어야 하는지 설명하고 있으며, 어떻게 프로그램의 출력에 맞게 할 것인지를 언어의 문장으로 설명하는 의미구조가 있다.
-  순수함수
    - 함수는 주어진 입력으로 계산하는 것 이외에 프로그램의 실행에 영향을 미치지 않아야 하며, 이를 부수 효과(side effect)가 없어야 한다
    - 예를 들어, count, length 함수는 임의의 문자열이나 배열에 대해서 항상 같은 길이를 반환하며, 그 외의 일은 일어나지 않는다.
-  불변성
   - **변경할 수 없는**  것이란 해당 요소를 생성한 후에 수정할 수 없다는 것이다. 반대로,  **변경 가능한**  객체는 생성된 후에 수정할 수 있는 객체이다.
   - 불변성이 중요한 이유는 불변성을 빼놓고 보면 프로그램의 데이터 흐름이 손실되기 때문이다. 상태 히스토리는 없어지고 이상한 버그가 소프트웨어에 끼어들 수 있다. [“The Dao of Immutability.”](https://medium.com/javascript-scene/the-dao-of-immutability-9f91a70c88cd)를 참조

-  참조 투명성
    - 모든 프로그램에 대해 어떤 표현식(expression) e를 모두 그 표현식의 결과로 치환해도 프로그램에 아무 영향이 없다면 그 표현식 e는 참조에 투명하다(referentially transparent). 만약 어떤 함수 f(x)가모든 입력값 x에 대해 참조에 투명하면 그 함수 f는 순수하다.  


### 이번주의 문제

[lodash api](https://lodash.com/docs/4.17.11)직접 구현해보기

- _.each
- _.uniq
- _.debounce
- ...