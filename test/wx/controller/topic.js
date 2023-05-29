const test = require('ava');
const { request } = require('../../helpers/app.js');

const TOPIC_ID = [
  264, 266, 268, 271, 272,
  274, 277, 281, 282, 283,
  286, 287, 289, 291, 294,
  295, 299, 300, 313, 314
];

test.serial('list', async (t) => {
  const url = '/wx/topic/list';
  let pages = 0;

  // No parameter
  {
    const response = await request({
      url,
      data: {
        sort: 'id',
        order: 'asc',
      },
    });

    const actual = response.body;
    const expected = require(`./topic/list_1.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);

    pages = actual.data.pages;
  }

  // With `page`
  for (let page = 1; page <= pages; page++) {
    const response = await request({
      url,
      data: {
        page,
        sort: 'id',
        order: 'asc',
      },
    });

    const actual = response.body;
    const expected = require(`./topic/list_${page}.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);
  }
});

test.serial('detail', async (t) => {
  const url = '/wx/topic/detail';

  // Missing `id`
  {
    const response = await request({ url });

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request({ url, data: { id: 99999999 } });

    // litemall returns 502
    t.is(response.body.errno, 402);
  }

  // With `id`
  await Promise.all(
    TOPIC_ID
      .map(async (id) => {
        const response = await request({ url, data: { id } });

        const actual = response.body;
        const expected = require(`./topic/detail_${id}.json`);

        t.is(actual.errno, expected.errno);
        t.deepEqual(actual.data, expected.data);
      })
  );
});

test.serial('related', async (t) => {
  const url = '/wx/topic/related';

  // Missing `id`
  {
    const response = await request({ url });

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request({ url, data: { id: 99999999 } });

    t.is(response.body.errno, 0);
  }

  // With `id`
  await Promise.all(
    TOPIC_ID
      .map(async (id) => {
        const response = await request({ url, data: { id } });

        const actual = response.body;
        const expected = require(`./topic/related_${id}.json`);

        t.is(actual.errno, expected.errno);
        t.deepEqual(actual.data, expected.data);
      })
  );
});
