const test = require('ava');
const { request } = require('../../helpers/app.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/home/index',
};

test('success', async (t) => {
  const response = await request(t, REQUEST);

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});
