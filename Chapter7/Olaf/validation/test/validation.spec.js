import { isEmpty, isTooShort, isTooLong } from '../helper'
import mockConsole from 'jest-mock-console';

import {IO} from '../iO'
import {Maybe} from '../maybe'

test("isEmpty 공백 체크", () => {
  expect(isEmpty("")).toBe(true);
});

test("isTooShort 문자의 길이는 3 보다 작을 수 없다 (11)", () => {
  expect(isTooShort(3)("12")).toBe(true);
});

test("isTooShort 문자의 길이는 2 보다 작을 수 없다 (111)", () => {
  expect(isTooShort(2)("111")).toBe(false);
});

test("isTooLong 문자의 길이는 3 보다 클 수 없다", () => {
  expect(isTooLong(3)("1234")).toBe(true);
});

test("Element 가 없을 경우", () => {
  const restoreConsole = mockConsole(); 
 
  IO.from(() => [])
    .flatMap(v => Maybe.of(v))
    .map(v => v.value)
    .toValidation('해당하는 Element를 발견하지 못했습니다.')
    .getOr(console.error)

    expect(console.error.mock.calls).toEqual([["해당하는 Element를 발견하지 못했습니다."]]);
    restoreConsole();
});

