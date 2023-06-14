const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');

module.exports = class WeixinService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 获取接口调用凭据
   * @see https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html
   * @returns {Promise<string>}
   */
  async getAccessToken() {
    const cache = await think.cache('weixin') || {};
    const now = new Date();

    if (
      !think.isTrueEmpty(cache.accessToken) &&
      (now.getTime() / 1000) < cache.accessTokenExpire
    ) {
      return cache.accessToken;
    }

    const config = think.config('weixin');

    const response = await this.request({
      method: 'get',
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      params: {
        appid: config.appid,
        secret: config.secret,
        grant_type: 'client_credential',
      },
    });

    Object.assign(cache, {
      accessToken: response.access_token,
      accessTokenExpire: Math.floor(now.getTime() / 1000) + response.expires_in,
    });

    await think.cache('weixin', cache);

    return response.access_token;
  }

  /**
   * 获取不限制的小程序码
   * @see https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html
   * @param {string} scene 
   * @param {string} page 
   * @returns {Promise<{}>}
   */
  async getUnlimitedQrCode(scene, page) {
    const response = await this.request({
      method: 'post',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      params: {
        access_token: await this.getAccessToken(),
      },
      data: {
        scene,
        page,
      },
    });

    return response;
  }

  /**
   * 小程序登录
   * @see https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
   * @param {string} code 
   * @returns {Promise<object>}
   */
  async login(code) {
    const config = think.config('weixin');

    const response = await this.request({
      method: 'get',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: {
        appid: config.appid,
        secret: config.secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });

    return response;
  }

  /**
   * 
   * @see https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_1
   * @param {object} order 
   * @returns {Promise<{}>}
   */
  async createOrder(order) {
    const config = think.config('weixin');

    const response = await this.request({
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

    const xml = this.parseXml(response)?.xml;

    if (!think.isObject(xml)) {
      throw new Error(`Weixin createOrder XML parse error`);
    }

    if ('SUCCESS' != xml.return_code) {
      throw new Error(`weixin createOrder fail: ${JSON.stringify(xml)}`);
    }

    return xml;
  }

  /**
   * 
   * @param {object} order 
   * @returns {Promise<{}>}
   */
  async createOrderV3(order) {
    const config = think.config('weixin');

    const response = await this.request({
      method: 'post',
      url: '?',
      data: {
        appid: config.appid,
        mch_id: config.mchId,
        notify_url: config.notifyUrl,
        amount: {
          total: 0,
          currency: null,
          payer_total: 0,
          payer_currency: null,
        },
        payer: {
          openid: '',
        },
        detail: null,
        scene_info: null,
        attach: null,
        description: '',
        time_expire: '',
        settle_info: null,
      },
    });

    return response;
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

  async request(request) {
    const response = await axios(request);

    if (200 != response.status) {
      console.error(response);
      throw new Error(`weixin status: ${response.status}`);
    }

    if (!think.isEmpty(response.data.errcode)) {
      console.error(response);
      throw new Error(`weixin error ${response.data.errcode}: ${response.data.errmsg}`);
    }

    return response.data;
  }
}