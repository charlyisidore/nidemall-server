const test = require('ava');
const { dualRequest, deepEqualType } = require('../helpers/app.js');

test('/wx/home/index', async (t) => {
  const [nideResponse, liteResponse] = await dualRequest(t, {
    path: '/wx/home/index',
  })

  t.is(nideResponse.errno, 0, '/index success');
  t.is(nideResponse.errno, liteResponse.errno, '/index diff errno');

  deepEqualType(t, nideResponse.data, liteResponse.data);
});

test('/wx/home/about', async (t) => {
  const [nideResponse, liteResponse] = await dualRequest(t, {
    path: '/wx/home/about',
  })

  t.is(nideResponse.errno, 0, '/about success');
  t.is(nideResponse.errno, liteResponse.errno, '/about diff errno');

  deepEqualType(t, nideResponse.data, liteResponse.data);
});
