const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createCart, destroyCart } = require('../helpers/cart.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/cart/checked',
};

test('check', async (t) => {
  const { token, id: userId } = await createUser();
  const carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart({ userId, checked: false }))
  );

  t.teardown(async () => {
    await Promise.all(carts.map((cart) => destroyCart(cart.id)));
    await destroyUser(userId);
  });

  const response = await request(t, {
    ...REQUEST,
    token,
    data: {
      productIds: carts.map((cart) => cart.productId),
      isChecked: 1,
    },
  });

  t.is(response.errno, 0);
  t.assert(response.data.cartList.every((cart) => (true === cart.checked)));

  await validateResponse(REQUEST, response, t);
});

test('uncheck', async (t) => {
  const { token, id: userId } = await createUser();
  const carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart({ userId, checked: true }))
  );

  t.teardown(async () => {
    await Promise.all(carts.map((cart) => destroyCart(cart.id)));
    await destroyUser(userId);
  });

  const response = await request(t, {
    ...REQUEST,
    token,
    data: {
      productIds: carts.map((cart) => cart.productId),
      isChecked: 0,
    },
  });

  t.is(response.errno, 0);
  t.assert(response.data.cartList.every((cart) => (false === cart.checked)));

  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart())
  );

  t.teardown(async () => {
    await Promise.all(carts.map((cart) => destroyCart(cart.id)));
  });

  const response = await request(t, {
    ...REQUEST,
    data: {
      productIds: carts.map((cart) => cart.productId),
      isChecked: 1,
    },
  });

  t.is(response.errno, 501);
});
