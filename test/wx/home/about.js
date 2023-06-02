const test = require('ava');
const { request, deepEqualType } = require('../../helpers/app.js');

const ABOUT_DATA = {
  "qq": "705144434",
  "address": "上海",
  "phone": "021-xxxx-xxxx",
  "latitude": "31.201900",
  "name": "litemall",
  "longitude": "121.587839"
};

test('success', async (t) => {
  const response = await request(t, {
    path: '/wx/home/about',
  });

  t.is(response.errno, 0);
  deepEqualType(t, response.data, ABOUT_DATA);
});
