const test = require('ava');
const { dualRequest, deepEqualType } = require('../helpers/app.js');

test('/wx/home/index', async (t) => {
  const [nideResponse, liteResponse] = await dualRequest(t, {
    path: '/wx/home/index',
  })

  t.is(nideResponse.errno, 0, '/index success');
  t.is(nideResponse.errno, liteResponse.errno, '/index diff errno');

  const omitKeys = ['grouponList'];
  deepEqualType(
    t,
    think.omit(nideResponse.data, omitKeys),
    think.omit(liteResponse.data, omitKeys)
  );
});
