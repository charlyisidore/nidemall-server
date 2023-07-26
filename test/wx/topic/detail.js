const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createTopic, destroyTopic } = require('../helpers/topic.js');
const { createGoods, destroyGoods } = require('../helpers/goods.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/topic/detail',
};

test('success', async (t) => {
  const goodsList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createGoods()
    )
  );

  const topic = await createTopic({
    goods: goodsList.map((goods) => goods.id),
  });

  t.teardown(async () => {
    await destroyTopic(topic.id);
    await Promise.all(goodsList.map((goods) => destroyGoods(goods.id)));
  });

  const response = await request(t, {
    ...REQUEST,
    data: { id: topic.id },
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.userHasCollect));
  t.assert(Array.isArray(response.data.goods));

  t.deepEqual(response.data.topic, topic);
  await validateResponse(REQUEST, response, t);
});

test('no goods on sale', async (t) => {
  const goodsList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createGoods({
        isOnSale: false,
      })
    )
  );

  const topic = await createTopic({
    goods: goodsList.map((goods) => goods.id),
  });

  t.teardown(async () => {
    await destroyTopic(topic.id);
    await Promise.all(goodsList.map((goods) => destroyGoods(goods.id)));
  });

  const response = await request(t, {
    ...REQUEST,
    data: { id: topic.id },
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.userHasCollect));
  t.assert(Array.isArray(response.data.goods));

  t.deepEqual(response.data.topic, topic);
  await validateResponse(REQUEST, response, t);
});

test('user has collect', async (t) => {
  const user = await createUser();
  const topic = await createTopic();

  t.teardown(async () => {
    await destroyTopic(topic.id);
    await destroyUser(user.id);
  });

  const response = await request(t, {
    ...REQUEST,
    token: user.token,
    data: { id: topic.id },
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.userHasCollect));
  t.assert(Array.isArray(response.data.goods));

  t.deepEqual(response.data.topic, topic);
  await validateResponse(REQUEST, response, t);
});

test('not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: 99999999 },
  });

  t.is(response.errno, 402);
});
