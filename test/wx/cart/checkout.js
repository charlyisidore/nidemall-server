const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createCart, destroyCart } = require('../helpers/cart.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/cart/checkout',
};

test.beforeEach(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
  t.context.carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart({
      userId: t.context.userId,
    }))
  );
});

test.afterEach(async (t) => {
  await Promise.all(t.context.carts.map((cart) => destroyCart(cart.id)));
  await destroyUser(t.context.userId);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      cartId: 0,
      addressId: 0,
      couponId: 0,
      userCouponId: 0,
      grouponRulesId: 0,
    },
  });

  t.is(response.errno, 0);

  const {
    goodsTotalPrice,
    freightPrice,
    couponPrice,
    orderTotalPrice,
    actualPrice,
    checkedGoodsList,
  } = response.data;

  t.assert(checkedGoodsList.every((cart) => cart.checked));

  t.is(goodsTotalPrice, checkedGoodsList.map((cart) => cart.price).reduce((w, v) => w + v, 0));
  t.is(orderTotalPrice, Math.max(0.0, goodsTotalPrice + freightPrice - couponPrice));
  t.is(actualPrice, orderTotalPrice);

  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: {
      cartId: 0,
      addressId: 0,
      couponId: 0,
      userCouponId: 0,
      grouponRulesId: 0,
    },
  });

  t.is(response.errno, 501);
});
