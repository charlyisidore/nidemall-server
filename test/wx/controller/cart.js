const test = require('ava');
const { request, login, omit } = require('../../helpers/app.js');

const CART = [
  {
    goodsId: 1181000,
    productId: 1,
    number: 1,
  },
  {
    goodsId: 1181000,
    productId: 2,
    number: 2,
  },
];

const CART_NO_STOCK = [
  {
    goodsId: 1181000,
    productId: 2,
    number: 99999999,
  },
];

test.serial('unauth', async (t) => {
  const options = [
    { method: 'get', url: '/wx/cart/index' },
    { method: 'post', url: '/wx/cart/add', data: CART[0] },
    { method: 'post', url: '/wx/cart/fastadd', data: CART[0] },
    { method: 'post', url: '/wx/cart/update', data: { id: 99999999, ...CART[0] } },
    { method: 'post', url: '/wx/cart/checked', data: { productIds: [99999999], isChecked: true } },
    { method: 'post', url: '/wx/cart/delete', data: { productIds: [99999999] } },
    { method: 'get', url: '/wx/cart/checkout' },
  ];

  await Promise.all(
    options.map(async (opts) => {
      const response = await request(opts);

      t.is(response.body.errno, 501);
    })
  );
});

test.serial('goodscount unauth', async (t) => {
  const url = '/wx/cart/goodscount';

  const response = await request({ url });

  t.is(response.body.errno, 0);
  t.is(response.body.data, 0);
});

test.serial.before(async (t) => {
  t.context.token = await login({
    username: 'user123',
    password: 'user123',
  });
});

test.serial('add', async (t) => {
  const url = '/wx/cart/add';

  await Promise.all(
    CART
      .map(async (data) => {
        const response = await request({
          method: 'post',
          url,
          token: t.context.token,
          data,
        });

        const actual = response.body;

        t.is(actual.errno, 0);
        t.assert(Number.isInteger(actual.data));
      })
  );

  await Promise.all(
    CART_NO_STOCK
      .map(async (data) => {
        const response = await request({
          method: 'post',
          url,
          token: t.context.token,
          data,
        });

        const actual = response.body;

        t.is(actual.errno, 711);
      })
  );
});

test.serial.before(async (t) => {
  t.context.carts = (await think.model('cart')
    .field('id,goodsId,productId,number')
    .where({ deleted: false })
    .order({ id: 'DESC' })
    .limit(CART.length)
    .select())
    .reverse();
});

test.serial('update', async (t) => {
  const url = '/wx/cart/update';

  await Promise.all(
    t.context.carts
      .map(async (data) => {
        const response = await request({
          method: 'post',
          url,
          token: t.context.token,
          data: {
            ...data,
            number: data.number + 1,
          },
        });

        t.is(response.body.errno, 0);
      })
  );

  await Promise.all(
    t.context.carts
      .map(async (data) => {
        const response = await request({
          method: 'post',
          url,
          token: t.context.token,
          data: {
            ...data,
            number: 99999999,
          },
        });

        t.is(response.body.errno, 710);
      })
  );
});

test.serial('checked', async (t) => {
  const url = '/wx/cart/checked';

  const response = await request({
    method: 'post',
    url,
    token: t.context.token,
    data: {
      productIds: t.context.carts.map((cart) => cart.productId),
      isChecked: true,
    },
  });

  t.is(response.body.errno, 0);
});

test.serial('goodscount auth', async (t) => {
  const url = '/wx/cart/goodscount';

  const response = await request({ url, token: t.context.token });

  t.is(response.body.errno, 0);
  t.not(response.body.data, 0);
  t.assert(response.body.data > 0);
});

test.serial('index', async (t) => {
  const url = '/wx/cart/index';

  const response = await request({ url, token: t.context.token });

  t.is(response.body.errno, 0);
});

test.serial('delete', async (t) => {
  const url = '/wx/cart/delete';

  const response = await request({
    method: 'post',
    url,
    token: t.context.token,
    data: {
      productIds: t.context.carts.map((cart) => cart.productId),
    },
  });

  t.is(response.body.errno, 0);
});
