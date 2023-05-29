const axios = require('axios');

module.exports = class WeixinService extends think.Service {
  constructor() {
    super();
  }

  login(code) {
    const config = think.config('weixin');

    // https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
    // https://developers.weixin.qq.com/miniprogram/en/dev/api-backend/open-api/login/auth.code2Session.html
    return axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: config.appid,
        secret: config.secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });
  }

  createOrder(order) {
    const config = think.config('weixin');

    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
    // https://pay.weixin.qq.com/wiki/doc/api/wxpay/en/pay/NativePay/chapter8_1.shtml
    return axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      params: {
        appid: config.appid,
        mch_id: config.mchId,
        partner_key: config.partnerKey,
        notify_url: config.notifyUrl,
        trade_type: 'MWEB',
        body: order.body,
        out_trade_no: order.outTradeNo,
        total_fee: order.totalFee,
        spbill_create_ip: order.spbillCreateIp,
      }
    });
  }
}