import {Validation} from './Validation'

export class Maybe {
  static of(value) {
    return value !== undefined && value !== null ? new Just(value) : new Nothing()
  }
}

export class Just extends Maybe {
  constructor(value) {
    super()
    this._value = value
  }

  map(mapper) {
    return Maybe.of(mapper(this._value))
  }
  
  flatMap(mapper) {
    return mapper(this._value)
  }

  toValidation() {
    return Validation.success(this._value)
  }
}

export class Nothing extends Maybe {
  map() {
    return this
  }

  flatMap() {
    return null
  }

  toValidation(failValue) {
    return Validation.fail(failValue)
  }
}