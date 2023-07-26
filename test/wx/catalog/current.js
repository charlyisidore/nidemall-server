const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createCategory, destroyCategory } = require('../helpers/category.js');
const { createGoods, destroyGoods } = require('../helpers/goods.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/catalog/current',
};

test('success', async (t) => {
  const category = await createCategory();
  const goodsList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createGoods({
        categoryId: category.id,
      })
    )
  );

  t.teardown(async () => {
    await Promise.all(goodsList.map((goods) => destroyGoods(goods.id)));
    await destroyCategory(category.id);
  });

  const response = await request(t, {
    ...REQUEST,
    data: {
      id: category.id,
    },
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});
