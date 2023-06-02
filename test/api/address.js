const test = require('ava');
const { dualRequest, loginUser, deepEqualTypes } = require('../helpers/app.js');

const DATA = {
  name: 'my name',
  tel: '13456789012',
  province: 'my province',
  city: 'my city',
  county: 'my county',
  areaCode: '123456',
  addressDetail: 'my address detail',
  isDefault: false,
};

// Create a user
test.before(async (t) => {
  const nideLogin = await loginUser(t);
  const liteLogin = await loginUser(t, { litemall: true });

  t.context.tokens = [
    nideLogin.token,
    liteLogin.token,
  ];
});

test('/wx/address', async (t) => {
  let nideAddressId = null;
  let liteAddressId = null;

  // Save
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      method: 'post',
      path: '/wx/address/save',
      tokens: t.context.tokens,
      data: DATA,
    })

    t.is(nideResponse.errno, 0, '/wx/address/save success');
    t.is(nideResponse.errno, liteResponse.errno, '/wx/address/save diff errno');

    nideAddressId = nideResponse.data;
    liteAddressId = liteResponse.data;
  }

  // Detail
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      path: '/wx/address/detail',
      tokens: t.context.tokens,
      datas: [
        { id: nideAddressId },
        { id: liteAddressId },
      ],
    });

    t.is(nideResponse.errno, 0, '/wx/address/save success');
    t.is(nideResponse.errno, liteResponse.errno, '/wx/address/detail diff errno');

    deepEqualTypes(t, nideResponse.data, liteResponse.data);

    const omitKeys = ['id', 'addTime', 'updateTime'];
    t.deepEqual(
      think.omit(nideResponse.data, omitKeys),
      think.omit(liteResponse.data, omitKeys),
      '/wx/address/detail diff data'
    );
  }

  // List
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      path: '/wx/address/list',
      tokens: t.context.tokens,
    });

    t.is(nideResponse.errno, 0, '/wx/address/save success');
    t.is(nideResponse.errno, liteResponse.errno, '/wx/address/list diff errno');

    t.assert(think.isArray(nideResponse.data?.list), '/wx/address/list nidemall not a list');
    t.assert(think.isArray(liteResponse.data?.list), '/wx/address/list litemall not a list');

    t.assert(nideResponse.data.list.length > 0, '/wx/address/list empty nidemall list');
    t.assert(liteResponse.data.list.length > 0, '/wx/address/list empty litemall list');

    deepEqualTypes(t, nideResponse.data, liteResponse.data);
  }

  // Delete
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      method: 'post',
      path: '/wx/address/delete',
      tokens: t.context.tokens,
      datas: [
        { id: nideAddressId },
        { id: liteAddressId },
      ],
    });

    t.is(nideResponse.errno, liteResponse.errno, '/wx/address/delete diff errno');
  }
});
