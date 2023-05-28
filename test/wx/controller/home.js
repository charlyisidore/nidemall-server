const test = require('ava');
const { request, omit } = require('../../helpers/app.js');

test.serial('index', async (t) => {
  const url = '/wx/home/index';
  const response = await request({ url });

  const actual = response.body;
  const expected = require('./home/index.json');
  const omitKeys = ['grouponList', 'topicList'];

  t.is(actual.errno, expected.errno);

  t.deepEqual(
    omit(actual.data, omitKeys),
    omit(expected.data, omitKeys)
  );
});

test.serial('about', async (t) => {
  const url = '/wx/home/about';
  const response = await request({ url });

  const actual = response.body;
  const expected = require('./home/about.json');

  t.is(actual.errno, expected.errno);
  t.deepEqual(actual.data, expected.data);
});
