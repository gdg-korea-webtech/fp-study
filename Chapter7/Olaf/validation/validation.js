export class Validation {
  constructor(value) {
    this._value = value
  }

  static of(value) {
    return new Success(value)
  }

  static success(value) {
    return new Success(value)
  }

  static fail(value) {
    return new Fail(value)
  }
}

export class Fail extends Validation {
  map() {
    return this
  }

  invalidMap(mapper) {
    return mapper(this._value)
  }
  
  flatMap() {
    return this._value
  }

  validate() {
    return this
  }

  getOr(fn) {
    return fn(this._value)
  }
}

export class Success extends Validation {
  map(mapper) {
    return Validation.of(mapper(this._value))
  }

  invalidMap() {
    return this
  }

  flatMap(mapper) {
    return mapper(this._value)
  }

  validate(predicate, message) {
    return predicate(this._value) ? new Success(this._value) : new Fail(message)
  }

  getOr() {
    return this._value
  }
}