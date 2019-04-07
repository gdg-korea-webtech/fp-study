import {
  Validator
} from './monads';
import {
  notExist,
  shorterThan2,
  longerThan10,
  shorterThan8,
  longerThan11,
} from './enhancer';

import './style.css';

const form = document.getElementById('form')
const name = form.querySelector('[name="name"]')
const phone = form.querySelector('[name="phone"]')

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameValue = Validator
    .fromNullable(name.value)
    .validate(notExist, "이름을 입력해주세요")
    .validate(shorterThan2, "이름이 너무 짧아요")
    .validate(longerThan10, "이름이 너무 길어요")
    .getOrElse(null);

  const phoneValue = Validator
    .fromNullable(phone.value)
    .validate(notExist, "전화번호를 입력해주세요")
    .validate(shorterThan8, "전화번호가 너무 짧아요")
    .validate(longerThan11, "전화번호가 너무 길어요")
    .getOrElse(null);

  if (nameValue && phoneValue) {
    console.info(nameValue, phoneValue, '정상 제출 되었어요.');
  }
});