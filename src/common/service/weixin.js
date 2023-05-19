const axios = require('axios');

module.exports = class extends think.Service {
  constructor() {
    super();
  }

  login(code) {
    const config = think.config('weixin');

    return this.authCode2Session({
      appid: config.appid,
      secret: config.secret,
      js_code: code,
      grant_type: 'authorization_code',
    });
  }

  authCode2Session(params) {
    // https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
    // https://developers.weixin.qq.com/miniprogram/en/dev/api-backend/open-api/login/auth.code2Session.html
    return axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: params.appid,
        secret: params.secret,
        js_code: params.js_code,
        grant_type: params.grant_type,
      },
    });
  }
}