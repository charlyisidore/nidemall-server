const test = require('ava');
const { request } = require('../../helpers/app.js');

const BRAND_ID = [
  1001000, 1001002, 1001003, 1001007, 1001008,
  1001010, 1001012, 1001013, 1001015, 1001016,
  1001020, 1001037, 1001038, 1001039, 1001045,
  1003000, 1005001, 1006000, 1008000, 1010001,
  1010002, 1015000, 1016002, 1018000, 1021000,
  1022000, 1022001, 1023000, 1024000, 1024001,
  1024003, 1024006, 1025000, 1025001, 1026000,
  1026001, 1028000, 1028003, 1033003, 1033004,
  1034001, 1037000, 1038000, 1038001, 1039000,
  1039001, 1040000, 1041000, 1046000
];

test.serial('list', async (t) => {
  const url = '/wx/brand/list';
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
    const expected = require(`./brand/list_1.json`);

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
    const expected = require(`./brand/list_${page}.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);
  }
});

test.serial('detail', async (t) => {
  const url = '/wx/brand/detail';

  // Missing `id`
  {
    const response = await request({ url });

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request({ url, data: { id: 99999999 } });

    t.is(response.body.errno, 402);
  }

  // With `id`
  await Promise.all(
    BRAND_ID
      .map(async (id) => {
        const response = await request({ url, data: { id } });

        const actual = response.body;
        const expected = require(`./brand/detail_${id}.json`);

        t.is(actual.errno, expected.errno);
        t.deepEqual(actual.data, expected.data);
      })
  );
});
