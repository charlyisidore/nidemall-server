const test = require('ava');
const request = require('supertest');
const path = require('path');
require(path.join(process.cwd(), 'production.js'));

const CATEGORY_ID = [
  1005000, 1005001, 1005002, 1008000, 1010000, 1011000,
  1012000, 1013001, 1019000, 1008002, 1008008, 1008009,
  1008016, 1010003, 1011003, 1011004, 1015000, 1017000,
  1036000, 1005007, 1005008, 1005009, 1007000, 1008011,
  1008012, 1008013, 1013005, 1023000, 1005010, 1005011,
  1005012, 1005013, 1008014, 1008015, 1027000, 1027001,
  1035003, 1036003, 1008003, 1008007, 1008010, 1008018,
  1010004, 1012001, 1013000, 1020008, 1022000, 1008004,
  1010001, 1010002, 1013006, 1015001, 1020009, 1020010,
  1034000, 1035000, 1035001, 1035002, 1011001, 1020003,
  1020004, 1020005, 1020006, 1020007, 1034001, 1008005,
  1008006, 1008017, 1011002, 1012002, 1012003, 1020000,
  1021000, 1036001, 1036002, 1008001, 1009000, 1013002,
  1013003, 1013004, 1020001, 1020002, 1018000, 1025000,
  1028001, 1032000, 1032001, 1032002, 1032003, 1032004,
  1032005, 1033000, 1036004
];

test.serial('index', async (t) => {
  const url = '/wx/catalog/index';

  // Without `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200);

    const actual = response.body;
    const expected = require('./catalog/index.json');

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);
  }

  // With `id`
  await Promise.all(
    CATEGORY_ID
      .map(async (id) => {
        const response = await request(think.app.listen())
          .get(url)
          .query({ id })
          .expect('Content-Type', /json/)
          .expect(200);

        const actual = response.body;
        const expected = require(`./catalog/index_${id}.json`);

        t.is(actual.errno, expected.errno);
        t.deepEqual(actual.data, expected.data);
      })
  );
});

test.serial('current', async (t) => {
  const url = '/wx/catalog/current';

  // Missing `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200);

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .query({ id: 99999999 })
      .expect('Content-Type', /json/)
      .expect(200);

    t.is(response.body.errno, 402);
  }

  // With `id`
  await Promise.all(
    CATEGORY_ID
      .map(async (id) => {
        const response = await request(think.app.listen())
          .get(url)
          .query({ id })
          .expect('Content-Type', /json/)
          .expect(200);

        const actual = response.body;
        const expected = require(`./catalog/current_${id}.json`);

        t.is(actual.errno, expected.errno);
        t.deepEqual(actual.data, expected.data);
      })
  );
});

test.serial('all', async (t) => {
  const url = '/wx/catalog/all';
  const response = await request(think.app.listen())
    .get(url)
    .expect('Content-Type', /json/)
    .expect(200);

  const actual = response.body;
  const expected = require(`./catalog/all.json`);

  t.is(actual.errno, expected.errno);
  t.deepEqual(actual.data, expected.data);
});
