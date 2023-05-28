const supertest = require('supertest');
const path = require('path');
require(path.join(process.cwd(), 'production.js'));

const app = think.app.listen();

function request(options) {
  const tokenName = think.config('auth')?.header;
  const url = options.url;
  const method = options.method ?? 'get';
  const token = options.token ?? null;
  const data = options.data ?? null;

  let req = supertest(app);

  switch (method.toLowerCase()) {
    case 'get':
      req = req.get(url);
      if (!think.isEmpty(data)) {
        req = req.query(data);
      }
      break;
    case 'post':
      req = req.post(url);
      if (!think.isEmpty(data)) {
        req = req.send(data);
      }
      break;
    default:
      throw new Error('Unsupported HTTP method');
  }

  if (!think.isNullOrUndefined(token)) {
    req = req.set(tokenName, token);
  }

  return req
    .expect('Content-Type', /json/)
    .expect(200);
}

function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) => !keys.includes(k)
    )
  );
}

module.exports = {
  app,
  request,
  omit,
};