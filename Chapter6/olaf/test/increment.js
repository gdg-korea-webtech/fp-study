let count = 0;

function increment() {
  return (count += 1);
}

function increment2(num) {
  return (num += 1);
}

module.exports = {
  increment,
  increment2
};
