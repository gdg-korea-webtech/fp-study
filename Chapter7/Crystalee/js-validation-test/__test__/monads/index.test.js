import {
  Validator,
} from '../../src/monads';

describe('모나드 클래스 테스트', () => {
  test('Validator', () => {
    expect(Validator.fromNullable(null).getOrElse('this value is null')).toBe('this value is null');
    expect(Validator.fromNullable('this value is not null').getOrElse('this value is null')).toBe('this value is not null');
  });
});