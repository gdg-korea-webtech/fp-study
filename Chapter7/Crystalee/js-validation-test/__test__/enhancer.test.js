import {
  notExist,
  shorterThan2,
  longerThan10,
  shorterThan8,
  longerThan11,
} from '../src/enhancer';
import { exportAllDeclaration } from '@babel/types';

describe('조립된 함수 테스트', () => {
  test('notExist', () => {
    expect(notExist(null)).toBe(true);
    expect(notExist(undefined)).toBe(true);
    expect(notExist('')).toBe(true);
    expect(notExist('asdf')).toBe(false);
  });
});