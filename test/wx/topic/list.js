const test = require('ava');
const { request } = require('../../helpers/app.js');
const { createTopic, destroyTopic } = require('../helpers/topic.js');

const REQUEST = {
  method: 'get',
  path: '/wx/topic/list',
};

test.beforeEach(async (t) => {
  t.context.topicList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createTopic()
    )
  );
});

test.afterEach(async (t) => {
  await Promise.all(
    t.context.topicList
      .map((topic) => destroyTopic(topic.id))
  );
});

test('success', async (t) => {
  const response = await request(t, REQUEST);

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data.total));
  t.assert(Number.isInteger(response.data.pages));
  t.assert(Number.isInteger(response.data.limit));
  t.assert(Number.isInteger(response.data.page));
  t.assert(Array.isArray(response.data.list));
});
