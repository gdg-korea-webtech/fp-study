function isEmpty(value) {
  if (value === undefined || value === null || value === "") {
    throw new Error("해당 값은 빈값 일 수 없습니다.");
  }
  return value;
}

function isTooShort(value, length = 4) {
  if (value.length < length) {
    throw new Error(`최소 길이는 ${length} 입니다.`);
  }
  return value;
}

function isTooLong(value, length) {
  if (value.length > length) {
    throw new Error(`최대 길이는 ${length} 입니다.`);
  }
  return value;
}

function phoneRe(value) {
  if (
    !/^(010[-. ]?([0-9]{4})|(011|016|017|018|019)[-. ]?([0-9]{3,4}))[-. ]?([0-9]{4})$/.test(
      value
    )
  ) {
    throw new Error("전화번호 형식을 확인해주세요");
  }
  return value;
}

class IO {
  constructor(effect) {
    this.effect = effect;
  }
  static from(fn) {
    return new IO(fn);
  }
  map(fn) {
    return new IO(() => fn(this.effect()));
  }
  run() {
    return this.effect();
  }
}

const name = IO.from(() => "aaa")
  .map(isEmpty)
  .map(value => isTooShort(value, 2))
  .map(value => isTooLong(value, 15))
  .run();

const phone = IO.from(() => "010-4519-0740")
  .map(isEmpty)
  .map(value => phoneRe(value))
  .run();
