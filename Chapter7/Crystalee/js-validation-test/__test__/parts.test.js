import {
  isEmpty,
  isTooShort,
  isTooLong,
} from '../src/parts';

describe('부품이 되는 함수 테스트', () => {
  test('isEmpty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('not empty')).toBe(false);
  });
});