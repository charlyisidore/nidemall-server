const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createCart, destroyCart } = require('../helpers/cart.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/cart/index',
};

test.before(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
  t.context.carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart({ userId: t.context.userId }))
  );
});

test.after.always(async (t) => {
  await Promise.all(t.context.carts.map((cart) => destroyCart(cart.id)));
  await destroyUser(t.context.userId);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const response = await request(t, REQUEST);

  t.is(response.errno, 501);
});
