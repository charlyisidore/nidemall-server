const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createBrand, destroyBrand } = require('../helpers/brand.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/brand/list',
};

test.beforeEach(async (t) => {
  t.context.brandList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createBrand()
    )
  );
});

test.afterEach(async (t) => {
  await Promise.all(
    t.context.brandList
      .map((brand) => destroyBrand(brand.id))
  );
});

test('success', async (t) => {
  const response = await request(t, REQUEST);

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});
