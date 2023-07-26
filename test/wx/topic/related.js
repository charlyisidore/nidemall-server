const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createTopic, destroyTopic } = require('../helpers/topic.js');
const { validateResponse } = require('../../helpers/openapi.js');

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
  await t.notThrowsAsync(() => validateResponse(REQUEST, response));
});

test('not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: 99999999 },
  });

  t.is(response.errno, 0);
  await t.notThrowsAsync(() => validateResponse(REQUEST, response));
});
