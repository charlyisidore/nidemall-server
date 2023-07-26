const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createCart, destroyCart } = require('../helpers/cart.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/cart/delete',
};

test.beforeEach(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
  t.context.carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart({
      userId: t.context.userId,
      checked: false,
    }))
  );
});

test.afterEach(async (t) => {
  await Promise.all(t.context.carts.map((cart) => destroyCart(cart.id)));
  await destroyUser(t.context.userId);
});

test('success', async (t) => {
  const toDelete = t.context.carts
    .map((cart) => cart.productId)
    .filter((v, i) => (0 == (i % 2)));

  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      productIds: toDelete,
    },
  });

  t.is(response.errno, 0);

  const responseProductIds = response.data.cartList.map((cart) => cart.productId);

  t.assert(responseProductIds.every((id) => !toDelete.includes(id)));
  t.assert(toDelete.every((id) => !responseProductIds.includes(id)));

  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: {
      productIds: t.context.carts.map((cart) => cart.productId),
    },
  });

  t.is(response.errno, 501);
});
