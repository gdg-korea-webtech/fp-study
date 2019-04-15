const { memoize } = require("lodash");
const perf = require("execution-time")();

function measureExecutionTime(name, fn) {
  perf.start();

  const result = fn();

  const { time } = perf.stop();

  const seconds = Math.floor(time / 1000);
  const milliseconds = time - seconds * 1000;

  console.info(
    `${name}
    ---
    - Excution time: ${seconds}s ${milliseconds}ms
    - Result: ${result}
    ---`
  );
}

function fibonacci(n) {
  if (n === 0) {
    return 0;
  }

  if (n === 1) {
    return 1;
  }

  if (n === 2) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

const lodashMemoizedFibonacci = memoize(fibonacci);

function tcoFibonacci(n, left = 0, right = 1) {
  if (n === 0) {
    return left;
  }

  if (n === 1) {
    return right;
  }

  return tcoFibonacci(n - 1, right, left + right);
}

measureExecutionTime("Normal Fibonacci 45", fibonacci.bind(fibonacci, 45));
measureExecutionTime(
  "Lodash Memoized Fibonacci 45",
  lodashMemoizedFibonacci.bind(lodashMemoizedFibonacci, 45)
);
measureExecutionTime(
  "Tail Call Recursion Fibonacci 45",
  tcoFibonacci.bind(tcoFibonacci, 45)
);

measureExecutionTime(
  "Memoized Fibonacci 45 second",
  lodashMemoizedFibonacci.bind(lodashMemoizedFibonacci, 45)
);
measureExecutionTime(
  "Tail Call Recursion Fibonacci 45",
  tcoFibonacci.bind(tcoFibonacci, 45)
);

measureExecutionTime(
  "Tail Call Recursion Fibonacci 100",
  tcoFibonacci.bind(tcoFibonacci, 100)
);
