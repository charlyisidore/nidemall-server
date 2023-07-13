const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createCategory, destroyCategory } = require('../helpers/category.js');

test('success', async (t) => {
  const categoryList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createCategory({
        pid: category.id,
        level: 'L1',
      })
    )
  );

  t.teardown(async () => {
    await Promise.all(categoryList.map((c) => destroyCategory(c.id)));
  });

  const response = await request(t, {
    path: '/wx/catalog/index',
  });

  t.is(response.errno, 0);
});

test('with id', async (t) => {
  const category = await createCategory({
    level: 'L1',
  });
  const subcategoryList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createCategory({
        pid: category.id,
        level: 'L2',
      })
    )
  );

  t.teardown(async () => {
    await Promise.all(subcategoryList.map((c) => destroyCategory(c.id)));
    await destroyCategory(category.id);
  });

  const response = await request(t, {
    path: '/wx/catalog/index',
    data: {
      id: category.id,
    },
  });

  t.is(response.errno, 0);
});
