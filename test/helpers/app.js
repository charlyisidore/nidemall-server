const supertest = require('supertest');
const path = require('node:path');
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

function randomString(n) {
  return Array.from(
    Array(n),
    () => Math.floor(Math.random() * 36).toString(36)
  ).join('');
}

async function createUser() {
  const authService = think.service('auth');

  const username = randomString(16);
  const password = randomString(16);

  const id = await think.model('user')
    .add({ username, password });

  const token = await authService.createToken(id);

  return { id, username, password, token };
}

function destroyUser(id) {
  return think.model('user')
    .where({ id })
    .delete();
}

module.exports = {
  app,
  request,
  createUser,
  destroyUser,
};