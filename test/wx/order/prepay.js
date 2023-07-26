const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createOrder, destroyOrder } = require('../helpers/order.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/order/prepay',
};

test.beforeEach(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
  t.context.order = await createOrder({ userId: t.context.userId });
});

test.afterEach(async (t) => {
  await destroyOrder(t.context.order.id);
  await destroyUser(t.context.userId);
});

test('success v1', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      orderId: t.context.order.id,
      apiVersion: 1,
    },
  });

  t.is(response.errno, 0);

  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: {
      orderId: t.context.order.id,
      apiVersion: 1,
    },
  });

  t.is(response.errno, 501);
});
