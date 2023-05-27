const test = require('ava');
const request = require('supertest');
const path = require('path');
require(path.join(process.cwd(), 'production.js'));

function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) => !keys.includes(k)
    )
  );
}

test.serial('index', async (t) => {
  const response = await request(think.app.listen())
    .get('/wx/home/index')
    .expect('Content-Type', /json/)
    .expect(200);

  const actual = response.body;
  const expected = require('./home/index.json');
  const ignoreKeys = ['grouponList', 'topicList'];

  t.is(actual.errno, expected.errno);

  t.deepEqual(
    omit(actual.data, ignoreKeys),
    omit(expected.data, ignoreKeys)
  );
});

test.serial('about', async (t) => {
  const response = await request(think.app.listen())
    .get('/wx/home/about')
    .expect('Content-Type', /json/)
    .expect(200);

  const actual = response.body;
  const expected = require('./home/about.json');

  t.is(actual.errno, expected.errno);
  t.deepEqual(actual.data, expected.data);
});
