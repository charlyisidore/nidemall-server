const test = require('ava');
const { request } = require('../../helpers/app.js');

const REQUEST = {
  method: 'get',
  path: '/wx/topic/list',
};

test('success', async (t) => {
  const response = await request(t, REQUEST);

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.total));
  t.assert(Number.isInteger(response.data.pages));
  t.assert(Number.isInteger(response.data.limit));
  t.assert(Number.isInteger(response.data.page));
  t.assert(Array.isArray(response.data.list));
});
