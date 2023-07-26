const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createGoods, destroyGoods } = require('../helpers/goods.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/goods/related',
};

test('success', async (t) => {
  const goods = await createGoods();
  t.teardown(async () => await destroyGoods(goods.id));

  const response = await request(t, {
    ...REQUEST,
    data: {
      id: 1015007, // goods.id,
    },
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});
