const test = require('ava');
const { request, login, omit } = require('../../helpers/app.js');

const ADDRESS = [
  {
    name: 'name1',
    tel: '13945678911',
    province: 'province1',
    city: 'city1',
    county: 'county1',
    areaCode: '123451',
    addressDetail: 'addressDetail1',
    isDefault: true,
  },
  {
    name: 'name2',
    tel: '13945678912',
    province: 'province2',
    city: 'city2',
    county: 'county2',
    areaCode: '123452',
    addressDetail: 'addressDetail2',
    isDefault: true,
  },
];

test.serial('unauth', async (t) => {
  const options = [
    { method: 'get', url: '/wx/address/list', data: {} },
    { method: 'get', url: '/wx/address/detail', data: { id: 99999999 } },
    { method: 'post', url: '/wx/address/save', data: ADDRESS[0] },
    { method: 'post', url: '/wx/address/delete', data: { id: 99999999 } },
  ];

  await Promise.all(
    options.map(async (opts) => {
      const response = await request(opts);

      t.is(response.body.errno, 501);
    })
  );
});

test.serial.before(async (t) => {
  t.context.token = await login({
    username: 'user123',
    password: 'user123',
  });
});

test.serial('save', async (t) => {
  const url = '/wx/address/save';

  await Promise.all(
    ADDRESS
      .map(async (data) => {
        const response = await request({
          method: 'post',
          url,
          token: t.context.token,
          data,
        });

        const actual = response.body;

        t.is(actual.errno, 0);
        t.assert(Number.isInteger(actual.data));
      })
  );
});

test.serial.before(async (t) => {
  /** @type {{ id: number, isDefault: boolean }[]} */
  const addressList = (await think.model('address')
    .field('id,isDefault')
    .where({ deleted: false })
    .order({ id: 'DESC' })
    .limit(ADDRESS.length)
    .select())
    .reverse();

  t.context.addressIds = addressList.map((address) => address.id);
  t.context.defaultAddressId = addressList.find((address) => address.isDefault)?.id;
});

test.serial('detail', async (t) => {
  const url = '/wx/address/detail';

  // Missing `id`
  {
    const response = await request({ url, token: t.context.token });

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request({
      url,
      token: t.context.token,
      data: { id: 99999999 },
    });

    t.is(response.body.errno, 402);
  }

  // With `id`
  await Promise.all(
    t.context.addressIds
      .map(async (id, i) => {
        const response = await request({
          url,
          token: t.context.token,
          data: { id },
        });

        const actual = response.body;
        const expectedData = {
          ...ADDRESS[i],
          id,
          isDefault: (id == t.context.defaultAddressId),
          deleted: false,
        };

        const omitKeys = ['userId', 'addTime', 'updateTime'];

        t.is(actual.errno, 0);

        t.deepEqual(
          omit(actual.data, omitKeys),
          omit(expectedData, omitKeys)
        );
      })
  );
});

test.serial('list', async (t) => {
  const url = '/wx/address/list';
  const response = await request({
    url,
    token: t.context.token,
  });

  const actual = response.body;

  t.is(actual.errno, 0);
  t.assert(Number.isInteger(actual.data.total));
  t.assert(Number.isInteger(actual.data.pages));
  t.assert(Number.isInteger(actual.data.limit));
  t.assert(Number.isInteger(actual.data.page));
  t.assert(Array.isArray(actual.data.list));

  const actualAdressIds = actual.data.list.map((address) => address.id);

  t.assert(t.context.addressIds.every(
    (id) => actualAdressIds.includes(id)
  ));
});

test.serial('delete', async (t) => {
  const url = '/wx/address/delete';

  await Promise.all(
    t.context.addressIds
      .map(async (id) => {
        const response = await request({
          method: 'post',
          url,
          token: t.context.token,
          data: { id },
        });

        const actual = response.body;

        t.is(actual.errno, 0);
      })
  );

  const addressIds = (await think.model('address')
    .field('id')
    .where({
      id: ['IN', t.context.addressIds],
      deleted: false,
    })
    .select())
    .map((address) => address.id);

  t.deepEqual(addressIds, []);
});
