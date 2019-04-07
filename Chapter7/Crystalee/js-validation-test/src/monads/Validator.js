
class Validator {
  constructor(value) {
    this._value = value;
  }

  get value() {
    return this._value
  }

  static left(a) {
    return new Left(a);
  }

  static right(a) {
    return new Right(a);
  }

  static fromNullable(val) {
    return val !== null && val !== undefined ? Validator.right(val) : Validator.left(val);
  }

  static of(a) {
    return Validator.right(a);
  }
}

class Left extends Validator {
  map(_) {
    return this; // not using
  }

  get value() {
    throw new TypeError("Left(a) 값을 가져올 수 없습니다.");
  }

  getOrElse(other) {
    return other;
  }

  orElse(f) {
    return f(this._value);
  }

  chain(f) {
    return this;
  }

  getOrElseThrow(a) {
    throw new Error(a);
  }

  filter(f) {
    return this;
  }

  validate(f, errorString) {
    return this;
  }

  toString() {
    return `Validator.Left(${this._value})`;
  }
}

class Right extends Validator {
  map(f) {
    return Validator.of(f(this._value));
  }

  get value() {
    return this._value;
  }

  getOrElse(other) {
    return this._value;
  }

  orElse() {
    return this; // not using
  }

  chain(f) {
    return f(this._value);
  }

  getOrElseThrow(a) {
    return this._value;
  }

  filter(f) {
    return Validator.fromNullable(f(this._value) ? this.value : null);
  }

  validate(f, errorString) {
    if (f(this._value)) {
      console.error(errorString);
      return Validator.fromNullable(null);
    } else {      
      return Validator.fromNullable(this.value);
    }
  }
}

export default Validator;