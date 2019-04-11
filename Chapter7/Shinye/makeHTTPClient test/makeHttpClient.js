function makeHttpClient(url) {
    return {
        get: (path) => `GET: ${url.baseURL}${path}`,
        post: (path) => `POST: ${url.baseURL}${path}`
    }
}

module.exports = makeHttpClient;
