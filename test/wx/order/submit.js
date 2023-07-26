const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createAddress, destroyAddress } = require('../helpers/address.js');
const { createCart, destroyCart } = require('../helpers/cart.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/order/submit',
};

test.beforeEach(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
  t.context.address = await createAddress({ userId: t.context.userId });
  t.context.carts = await Promise.all(
    Array.from({ length: 6 }, () => createCart({
      userId: t.context.userId,
      addressId: t.context.address.id,
      checked: true,
    }))
  );
});

test.afterEach(async (t) => {
  await Promise.all(t.context.carts.map((cart) => destroyCart(cart.id)));
  await destroyAddress(t.context.address.id);
  await destroyUser(t.context.userId);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      cartId: 0,
      addressId: t.context.address.id,
      couponId: 0,
      userCouponId: 0,
      message: '',
      grouponRulesId: 0,
      grouponLinkId: 0,
    },
  });

  t.is(response.errno, 0);

  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: {
      cartId: 0,
      addressId: t.context.address.id,
      couponId: 0,
      userCouponId: 0,
      message: '',
      grouponRulesId: 0,
      grouponLinkId: 0,
    },
  });

  t.is(response.errno, 501);
});
