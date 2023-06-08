const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');

module.exports = class WeixinService extends think.Service {
  constructor() {
    super();
  }

  async login(code) {
    const config = think.config('weixin');

    // https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
    // https://developers.weixin.qq.com/miniprogram/en/dev/api-backend/open-api/login/auth.code2Session.html
    const response = await axios({
      method: 'get',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: {
        appid: config.appid,
        secret: config.secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });

    if (200 != response.status) {
      throw new Error(`Weixin login error: status ${response.status}`);
    }

    return response.data;
  }

  async createOrder(order) {
    const config = think.config('weixin');

    // TODO: use APIv3
    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
    // https://pay.weixin.qq.com/wiki/doc/api/wxpay/en/pay/NativePay/chapter8_1.shtml
    const response = await axios({
      method: 'post',
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      data: this.buildXml({
        xml: {
          appid: config.appid,
          mch_id: config.mchId,
          partner_key: config.partnerKey,
          notify_url: config.notifyUrl,
          trade_type: 'MWEB',
          body: order.body,
          out_trade_no: order.outTradeNo,
          total_fee: order.totalFee,
          spbill_create_ip: order.spbillCreateIp,
        },
      }),
    });

    if (200 != response.status) {
      throw new Error(`Weixin createOrder error: status ${response.status}`);
    }

    const xml = this.parseXml(response.data)?.xml;

    if (!think.isObject(xml)) {
      throw new Error(`Weixin createOrder error: response is not a valid object`);
    }

    if ('SUCCESS' != xml.return_code) {
      throw new Error(`Weixin createOrder fail: ${JSON.stringify(xml)}`);
    }

    return xml;
  }

  /**
   * 
   * @param {string} sessionKey 
   * @param {string} encryptedData 
   * @param {string} iv 
   */
  getPhoneNoInfo(sessionKey, encryptedData, iv) {
    // TODO
    // decrypt(sessionKey, encryptedData, iv)
    return {
      phoneNumber: '',
      purePhoneNumber: '',
      countryCode: '',
      watermark: {
        appid: '',
        timestamp: '',
      },
    };
  }

  buildXml(obj) {
    const builder = new XMLBuilder();
    return builder.build(obj);
  }

  parseXml(xml) {
    const parser = new XMLParser();
    return parser.parse(xml);
  }
}