import {
  isEmpty,
  isTooShort,
  isTooLong,
} from './parts';

import _ from 'lodash';

const notExist = isEmpty
const shorterThan2 = _.partial(isTooShort, _, 2);
const shorterThan8 = _.partial(isTooShort, _, 8);
const longerThan10 = _.partial(isTooLong, _, 10);
const longerThan11 = _.partial(isTooLong, _, 11);

export {
  notExist,
  shorterThan2,
  longerThan10,
  shorterThan8,
  longerThan11,
};

