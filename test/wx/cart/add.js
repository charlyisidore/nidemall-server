const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createGoodsProduct, destroyGoodsProduct } = require('../helpers/goods_product.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/cart/add',
};

test.before(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
  t.context.product = await createGoodsProduct();
});

test.after.always(async (t) => {
  await destroyGoodsProduct(t.context.product.id);
  await destroyUser(t.context.userId);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      goodsId: t.context.product.goodsId,
      productId: t.context.product.id,
      number: 1,
    },
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});

test('no stock', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      goodsId: t.context.product.goodsId,
      productId: t.context.product.id,
      number: t.context.product.number + 1,
    },
  });

  t.is(response.errno, 711);
});

test('goods not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      goodsId: 999999,
      productId: t.context.product.id,
      number: 1,
    },
  });

  t.is(response.errno, 710);
});

test('product not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {
      goodsId: t.context.product.goodsId,
      productId: 999999,
      number: 1,
    },
  });

  t.is(response.errno, 711);
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: {
      goodsId: t.context.product.goodsId,
      productId: t.context.product.id,
      number: 1,
    },
  });

  t.is(response.errno, 501);
});
