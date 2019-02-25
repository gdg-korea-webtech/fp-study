const enrollment = [
  { enrolled: 2, grade: 100 },
  { enrolled: 2, grade: 80 },
  { enrolled: 1, grade: 89 },
]

const compose = (...functions) => {
  return ((parameter) => {
    functions.reduce((accumulator, eachFunction) => {
      return eachFunction(accumulator)
    }, parameter);
  });
}

const filter = (comparator) => {
  return (parameter) => parameter.filter(comparator);
}

const pluck = (attribute) => {
  return ((objectList) => objectList.map((object) => object[attribute]));
}

const average = (values) => values.reduce((acc, value) => acc + value , 0) / values.length;

const calculateAverage = compose(
  filter(student => student.enrolled > 1),
  pluck('grade'),
  average,
  console.log
)

calculateAverage(enrollment) // 90
