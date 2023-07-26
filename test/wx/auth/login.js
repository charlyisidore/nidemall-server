const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/auth/login',
};

test('success', async (t) => {
  const { id, username, password } = await createUser();
  t.teardown(async () => {
    await destroyUser(id);
  });

  const response = await request(t, {
    ...REQUEST,
    data: {
      username,
      password,
    },
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});
