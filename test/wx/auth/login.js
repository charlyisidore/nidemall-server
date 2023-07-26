const test = require('ava');
const { request } = require('../../helpers/app.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/auth/login',
};

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: {
      username: 'user123',
      password: 'user123',
    },
  });

  t.is(response.errno, 0);
  await t.notThrowsAsync(() => validateResponse(REQUEST, response));
});
