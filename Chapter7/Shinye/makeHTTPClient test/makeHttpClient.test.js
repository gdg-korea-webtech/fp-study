var makeHttpClient = require('./makeHttpClient');


describe("makeHTTP", () => {
  test("makeHTTP: GET", () => {
    var base_url = 'https://github.com/api';
    var input = '/users';
    var func = makeHttpClient({ baseURL: base_url });

    expect(func.get(input)).toEqual(`GET: ${base_url}${input}`);
  });

  test("makeHTTP: POST", () => {
    var base_url = 'https://github.com/api';
    var input = '/users';
    var func = makeHttpClient({ baseURL: base_url });

    expect(func.post(input)).toEqual(`POST: ${base_url}${input}`);
  });
});
