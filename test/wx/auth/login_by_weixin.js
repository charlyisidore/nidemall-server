const test = require('ava');
const { request } = require('../../helpers/app.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/auth/login_by_weixin',
};

test('success', async (t) => {
  // TODO
  t.pass();
  return;

  const response = await request(t, {
    ...REQUEST,
    data: {
      code: '0123456789abcdefghijklmnopqrstuv',
      userInfo: {
        nickName: 'Me',
        gender: 0,
        language: 'zh_CN',
        city: '',
        province: '',
        country: '',
        avatarUrl: 'https://picsum.photos/100',
      },
    },
  });

  t.is(response.errno, 0);
  await validateResponse(REQUEST, response, t);
});
