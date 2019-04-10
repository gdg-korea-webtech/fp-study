import {Validation} from './Validation'
import {IO} from './IO'
import {Maybe} from './Maybe'
import { isEmpty, isTooShort, isTooLong } from './helper'

const form = document.getElementById('form')

function not(fn) {
  return function(value) {
    return !fn(value)
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  IO.from(() => document.querySelector('[name="name"]'))
    .flatMap(v => Maybe.of(v))
    .map(v => v.value)
    .toValidation('해당하는 Element를 발견하지 못했습니다.')
    .validate(not(isEmpty), '이름을 입력해주세요.')
    .validate(not(isTooShort(2)), '이름이 너무 짧아요.')
    .validate(not(isTooLong(10)), '이름이 너무 길어요.')
    .getOr(console.error)

  IO.from(() => document.querySelector('[name="phone"]'))
    .flatMap(v => Maybe.of(v))
    .map(v => v.value)
    .toValidation('해당하는 Element를 발견하지 못했습니다.')
    .validate(not(isEmpty), '전화번호를 입력해주세요.')
    .validate(not(isTooShort(9)), '전화번호가 너무 짧아요.')
    .validate(not(isTooLong(12)), '전화번호가 너무 길어요.')
    .getOr(console.error)
});