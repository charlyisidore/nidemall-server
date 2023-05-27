const test = require('ava');
const request = require('supertest');
const path = require('path');
require(path.join(process.cwd(), 'production.js'));

test.serial('list', async (t) => {
  const url = '/wx/brand/list';
  let pages = 0;

  // No parameter
  {
    const response = await request(think.app.listen())
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200);

    const actual = response.body;
    const expected = require(`./brand/list_1.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);

    pages = actual.data.pages;
  }

  // With `page`
  for (let page = 1; page <= pages; page++) {
    const response = await request(think.app.listen())
      .get(url)
      .query({ page })
      .expect('Content-Type', /json/)
      .expect(200);

    const actual = response.body;
    const expected = require(`./brand/list_${page}.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);
  }
});
