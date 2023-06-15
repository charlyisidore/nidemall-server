const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createTopic, destroyTopic } = require('../helpers/topic.js');

const REQUEST = {
  method: 'get',
  path: '/wx/topic/related',
};

test.beforeEach(async (t) => {
  t.context.topic = await createTopic();
});

test.afterEach(async (t) => {
  await destroyTopic(t.context.topic.id);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: t.context.topic.id },
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.total));
  t.assert(Number.isInteger(response.data.pages));
  t.assert(Number.isInteger(response.data.limit));
  t.assert(Number.isInteger(response.data.page));
  t.assert(Array.isArray(response.data.list));
});

test('not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: 99999999 },
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.total));
  t.assert(Number.isInteger(response.data.pages));
  t.assert(Number.isInteger(response.data.limit));
  t.assert(Number.isInteger(response.data.page));
  t.assert(Array.isArray(response.data.list));
});
