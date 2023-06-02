const test = require('ava');
const { dualRequest, deepEqualType } = require('../helpers/app.js');

test('/wx/topic', async (t) => {
  let nideTopicId = null;
  let liteTopicId = null;

  // List
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      path: '/wx/topic/list',
    })

    t.is(nideResponse.errno, 0, '/list success');
    t.is(nideResponse.errno, liteResponse.errno, '/list diff errno');

    t.assert(Array.isArray(nideResponse.data?.list), '/list nidemall not a list');
    t.assert(Array.isArray(liteResponse.data?.list), '/list litemall not a list');

    nideTopicId = nideResponse.data.list[0].id;
    liteTopicId = liteResponse.data.list[0].id;
  }

  // Detail
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      path: '/wx/topic/detail',
      datas: [
        { id: nideTopicId },
        { id: liteTopicId },
      ],
    });

    t.is(nideResponse.errno, 0, '/detail success');
    t.is(nideResponse.errno, liteResponse.errno, '/detail diff errno');

    deepEqualType(t, nideResponse.data, liteResponse.data);
  }

  // Related
  {
    const [nideResponse, liteResponse] = await dualRequest(t, {
      path: '/wx/topic/related',
      datas: [
        { id: nideTopicId },
        { id: liteTopicId },
      ],
    });

    t.is(nideResponse.errno, 0, '/related success');
    t.is(nideResponse.errno, liteResponse.errno, '/related diff errno');

    t.assert(Array.isArray(nideResponse.data?.list), '/related nidemall not a list');
    t.assert(Array.isArray(liteResponse.data?.list), '/related litemall not a list');

    deepEqualType(t, nideResponse.data, liteResponse.data);
  }
});
