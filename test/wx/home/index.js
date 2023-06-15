const test = require('ava');
const { request } = require('../../helpers/app.js');

test('success', async (t) => {
  const response = await request(t, {
    path: '/wx/home/index',
  });

  t.is(response.errno, 0);
});
