const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createCategory, destroyCategory } = require('../helpers/category.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/goods/category',
};

test('success', async (t) => {
  const parentCategory = await createCategory();
  const currentCategory = await createCategory({ pid: parentCategory.id });
  const brotherCategories = await Promise.all(
    Array.from(
      { length: 11 },
      () => createCategory({
        pid: parentCategory.id,
      })
    )
  );

  t.teardown(async () => {
    await Promise.all([
      parentCategory,
      currentCategory,
      ...brotherCategories,
    ].map((category) => destroyCategory(category.id)));
  });

  const response = await request(t, {
    ...REQUEST,
    data: { id: currentCategory.id },
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});

test('not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: 99999999 },
  });

  t.is(response.errno, 402);
});
