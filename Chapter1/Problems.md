# 1. 현섭님 문제

```js
const enrollment = [
  { enrolled: 2, grade: 100 },
  { enrolled: 2, grade: 80 },
  { enrolled: 1, grade: 89 }
];

const calculateAverage = compose(
  filter(student => student.enrolled > 1),
  pluck("grade"),
  average,
  console.log
);

calculateAverage(enrollment); // 90
```

# 2. 신예님 문제 - lodash/clone 함수 구현하기
