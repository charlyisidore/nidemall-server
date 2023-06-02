const axios = require('axios');
const supertest = require('supertest');
const path = require('node:path');
require(path.join(process.cwd(), 'production.js'));

const app = think.app.listen();

const BASE_URL = `http://127.0.0.1:${app.address().port}`;

async function request(t, options) {
  const baseURL = options?.baseUrl ?? BASE_URL;
  const method = options?.method?.toUpperCase() ?? 'GET';
  const url = options?.path;
  const headers = {};
  const params = ('GET' == method) ? (options?.data ?? {}) : {};
  const data = ('GET' == method) ? {} : (options?.data ?? {});

  const tokenName = options?.tokenName ?? think.config('auth')?.header;
  const token = options?.token ?? null;

  if (!think.isNullOrUndefined(tokenName) && !think.isNullOrUndefined(token)) {
    Object.assign(headers, {
      [tokenName]: token,
    });
  }

  const response = await axios({
    baseURL,
    method,
    url,
    headers,
    params,
    data,
  });

  t.is(response.status, 200);
  t.regex(response.headers['content-type'], /json/);

  return response.data;
}

function randomString(n) {
  return Array.from(
    Array(n),
    () => Math.floor(Math.random() * 36).toString(36)
  ).join('');
}

async function createUser() {
  const authService = think.service('auth');

  const username = randomString(24);
  const password = randomString(24);

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