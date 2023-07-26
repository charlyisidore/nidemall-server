const axios = require('axios');
const path = require('node:path');
require(path.join(process.cwd(), 'production.js'));

const app = think.app.listen();

const BASE_URL = `http://127.0.0.1:${app.address().port}`;
const LITEMALL_BASE_URL = `http://127.0.0.1:8080`;

async function request(t, options) {
  const baseURL = options?.litemall ?
    LITEMALL_BASE_URL :
    (options?.baseUrl ?? BASE_URL);
  const method = options?.method?.toUpperCase() ?? 'GET';
  const url = options?.path;
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };
  const params = ('GET' == method) ? (options?.data ?? {}) : {};
  const data = ('GET' == method) ? {} : (options?.data ?? {});

  const tokenName = options?.litemall ?
    'X-Litemall-Token' :
    (options?.tokenName ?? think.config('auth')?.header);
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

  if (!think.isNullOrUndefined(t)) {
    t.is(response.status, 200);
    t.regex(response.headers['content-type'], /json/);
  }

  return response.data;
}

function dualRequest(t, options) {
  const nideOptions = Object.assign({ litemall: false }, options);
  const liteOptions = Object.assign({ litemall: true }, options);

  if (Array.isArray(options?.tokens) && options.tokens.length >= 2) {
    const [nideToken, liteToken] = options.tokens;
    Object.assign(nideOptions, { token: nideToken });
    Object.assign(liteOptions, { token: liteToken });
    delete nideOptions.tokens;
    delete liteOptions.tokens;
  }

  if (Array.isArray(options?.datas) && options.datas.length >= 2) {
    const [nideData, liteData] = options.datas;
    Object.assign(nideOptions, { data: nideData });
    Object.assign(liteOptions, { data: liteData });
    delete nideOptions.datas;
    delete liteOptions.datas;
  }

  return Promise.all([
    request(t, nideOptions),
    request(t, liteOptions),
  ]);
}

function randomString(n) {
  return Array.from(
    Array(n),
    () => Math.floor(Math.random() * 36).toString(36)
  ).join('');
}

async function loginUser(t, options = {}) {
  const username = 'user123';
  const password = 'user123';

  const response = await request(t, Object.assign({
    method: 'POST',
    path: '/wx/auth/login',
    data: { username, password },
  }, options));

  t.is(response.errno, 0);
  t.false(think.isNullOrUndefined(response?.data?.token));

  return {
    id: 1,
    username,
    password,
    token: response.data.token,
  };
}

async function createUser(data = {}) {
  const authService = think.service('auth');

  const now = think.datetime(new Date());
  const username = randomString(24);
  const password = randomString(24);
  const hash = await authService.hashPassword(password);

  const id = await think.model('user')
    .add({
      username,
      password: hash,
      addTime: now,
      updateTime: now,
      ...data,
    });

  const token = await authService.createToken(id);

  return { id, username, password, hash, token };
}

function destroyUser(id) {
  return think.model('user')
    .where({ id })
    .delete();
}

function deepEqualType(t, v1, v2) {
  t.is(typeof v1, typeof v2, 'diff types');

  if (think.isArray(v1)) {
    if (v1.length == 0 || v2.length == 0) {
      return;
    }

    const v0 = v2[0];
    v1.forEach((v) => deepEqualType(t, v, v0));
    v2.slice(1).forEach((v) => deepEqualType(t, v, v0));
  } else if (think.isObject(v1)) {
    t.deepEqual(
      Object.keys(v1).sort(),
      Object.keys(v2).sort(),
      'diff keys'
    );

    Object.entries(v1).forEach(([k, v]) => deepEqualType(t, v, v2[k]));
  }
}

module.exports = {
  app,
  request,
  dualRequest,
  loginUser,
  createUser,
  destroyUser,
  deepEqualType,
};