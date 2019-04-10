export class IO {
  constructor(effect) {
    this.effect = effect
  }

  static from(effect) {
    return new IO(effect)
  }

  map(mapper) {
    return new IO(
      () => {
        return mapper(this.effect())
      }
    )
  }

  flatMap(mapper) {
    return mapper(this.effect())
  }

  run() {
    this.effect()
  }
}