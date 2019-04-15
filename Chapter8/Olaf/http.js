const fetch = require("node-fetch");

function memoize(fn) {
  const cache = {};
  return async url => {
    if (cache[url]) {
      console.log(`cached: ${url}`);
      return cache[url];
    } else {
      const data = await fn(url);
      cache[url] = data;
    }
  };
}

async function http(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function init() {
  const memoizeFetch = memoize(http);

  Promise.all([
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/1/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/2/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/3/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/4/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/5/")
  ]);

  Promise.all([
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/1/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/2/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/3/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/4/"),
    await memoizeFetch("https://pokeapi.co/api/v2/pokemon/5/")
  ]);
}

init();
