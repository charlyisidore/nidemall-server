const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createBrand, destroyBrand } = require('../helpers/brand.js');

const REQUEST = {
  method: 'get',
  path: '/wx/brand/detail',
};

test.beforeEach(async (t) => {
  t.context.brand = await createBrand();
});

test.afterEach(async (t) => {
  await destroyBrand(t.context.brand.id);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: t.context.brand.id },
  });

  t.is(response.errno, 0);
  t.deepEqual(response.data, t.context.brand);
});

test('not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: 99999999 },
  });

  t.is(response.errno, 402);
});
