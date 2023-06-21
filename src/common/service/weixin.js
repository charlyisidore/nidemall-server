const Base = require('./base.js');
const WxPayError = require('../error/wx_pay.js');
const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const crypto = require('node:crypto');

module.exports = class WeixinService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} msg 
   * @returns {string}
   */
  success(msg) {
    return this.buildXml({
      xml: {
        return_code: 'SUCCESS',
        return_msg: msg,
      },
    });
  }

  /**
   * 
   * @param {string} msg 
   * @returns {string}
   */
  fail(msg) {
    return this.buildXml({
      xml: {
        return_code: 'FAIL',
        return_msg: msg,
      },
    });
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
   * @returns {Promise<{appId: string, timeStamp: string, nonceStr: string, package: string, signType: string, paySign: string}>}
   */
  async createOrder(order) {
    const config = think.config('weixin');

    const tradeType = 'JSAPI';
    const signType = 'MD5';
    /** @type {string} */
    const signKey = config.mchKey;
    const nonceStr = (new Date()).getTime().toString();

    const query = {
      appid: config.appid,
      mch_id: config.mchId,
      notify_url: config.notifyUrl,
      //
      trade_type: tradeType,
      sign_type: signType,
      nonce_str: nonceStr,
      //
      out_trade_no: order.outTradeNo,
      body: order.body,
      total_fee: order.totalFee,
      spbill_create_ip: order.spbillCreateIp,
    };

    Object.assign(query, {
      sign: this.createSign(query, signType, signKey),
    });

    const response = await this.request({
      method: 'post',
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      data: this.buildXml({ xml: query }),
    });

    const result = this.parseXml(response)?.xml;

    if (!think.isObject(result)) {
      throw new WxPayError(`weixin createOrder XML parse error`);
    }

    if (!this.checkSign(result, signType, signKey)) {
      think.logger.debug(`weixin createOrder checkSign 校验结果签名失败，参数：${JSON.stringify(responseXml)}`);
      throw new WxPayError('weixin createOrder checkSign 参数格式校验错误！');
    }

    if ('SUCCESS' != result.return_code) {
      think.logger.error(`weixin createOrder fail 结果业务代码异常，返回结果：${JSON.stringify(responseXml)}`);
      throw new WxPayError(`weixin createOrder fail`);
    }

    if (think.isTrueEmpty(result.prepay_id)) {
      think.logger.error(`weixin createOrder 无法获取prepay id，错误代码： '${result.err_code}'，信息：${result.err_code_des}。`)
      throw new WxPayError(`weixin createOrder 无法获取prepay id，错误代码： '${result.err_code}'，信息：${result.err_code_des}。`);
    }

    const now = new Date();

    const data = {
      appId: result.appid,
      timeStamp: Math.floor(now.getTime() / 1000).toString(),
      nonceStr: result.nonceStr,
      package: `prepay_id=${result.prepay_id}`,
      signType,
    };

    return Object.assign(data, {
      paySign: this.createSign(data, signType, signKey),
    });
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
        description: '',
        out_trade_no: order.outTradeNo,
        time_expire: null,
        attach: null,
        notify_url: config.notifyUrl,
        amount: {
          total: 0,
          currency: 'CNY',
          payer_total: null,
          payer_currency: null,
        },
        payer: {
          openid: '???',
        },
        detail: null,
        scene_info: null,
        settle_info: null,
      },
    });

    return response;
  }

  /**
   * 应用场景
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5
   * @param {{ outTradeNo: string, outRefundNo: string, totalFee: number, refundFee: number }} refundRequest
   * @returns {Promise<object>}
   */
  async refund(refundRequest) {
    const config = think.config('weixin');

    const response = await this.request({
      method: 'post',
      url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
      data: this.buildXml({
        appid: config.appid,
        secret: config.secret,
        mch_id: config.mchId,
        nonce_str: '',
        sign: '',
      }),
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

  /**
   * 
   * @param {object} params 
   * @param {string} signType 'HMAC-SHA256' or 'MD5'
   * @param {string} signKey 
   * @param {string[]} ignoredParams 
   * @returns {string}
   */
  createSign(params, signType, signKey, ignoredParams = []) {
    ignoredParams = ignoredParams.concat([
      'couponList',
      'key',
      'sign',
      'xmlDoc',
      'xmlString',
    ]);

    const toSign = Object.entries(params).reduce(
      (toSign, [key, value]) => {
        const valueStr = value.toString();
        if ('' === valueStr || ignoredParams.includes(key)) {
          return toSign;
        }
        return toSign.concat(`${key}=${valueStr}&`);
      }
    )
      .concat(`key=${signKey}`);

    switch (signType) {
      case 'HMAC-SHA256':
        return crypto
          .createHmac('sha256', signKey)
          .update(toSign)
          .digest('hex')
          .toUpperCase();
      case 'MD5':
        return crypto
          .createHash('md5')
          .update(toSign)
          .digest('hex')
          .toUpperCase();
      default:
        throw new Error(`${signType} unsupported`);
    }
  }

  /**
   * 
   * @param {object} params 
   * @param {string} signType 
   * @param {string} signKey 
   * @returns {boolean}
   */
  checkSign(params, signType, signKey) {
    if (think.isNullOrUndefined(params.sign)) {
      return false;
    }
    return params.sign == this.createSign(params, signType, signKey);
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
