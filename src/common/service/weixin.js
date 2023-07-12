const Base = require('./base.js');
const WxPayError = require('../error/wx_pay.js');
const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const crypto = require('node:crypto');

module.exports = class WeixinService extends Base {
  /**
   * .
   * @param {string} msg .
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
   * .
   * @param {string} msg .
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
   * .
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=23_1
   * @returns {Promise<string>}
   */
  async getSandboxSignKey() {
    const config = think.config('weixin');

    const query = {
      mch_id: config.mchId,
      nonce_str: this.createNonceStr(),
    };

    const result = await this.requestXml({
      url: 'https://api.mch.weixin.qq.com/xdc/apiv2getsignkey/sign/getsignkey',
      data: query,
    });

    if ('SUCCESS' != result.return_code) {
      think.logger.error(`weixin getSandboxSignKey fail: ${JSON.stringify(result)}`);
      throw new WxPayError(`weixin getSandboxSignKey fail`);
    }

    return result.sandbox_signkey;
  }

  /**
   * 获取不限制的小程序码
   * @see https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html
   * @param {string} scene .
   * @param {string} page .
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
   * @param {string} code .
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
   * .
   * @see https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_1
   * @param {object} order .
   * @returns {Promise<{appId: string, timeStamp: string, nonceStr: string, package: string, signType: string, paySign: string}>}
   */
  async createOrder(order) {
    const config = think.config('weixin');

    const tradeType = 'JSAPI';
    const signType = 'MD5';
    /** @type {string} */
    const signKey = config.mchKey;

    const query = {
      appid: config.appid,
      mch_id: config.mchId,
      notify_url: config.notifyUrl,
      //
      trade_type: tradeType,
      sign_type: signType,
      nonce_str: this.createNonceStr(),
      //
      out_trade_no: order.outTradeNo,
      body: order.body,
      total_fee: order.totalFee,
      spbill_create_ip: order.spbillCreateIp,
    };

    const result = await this.requestXml({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      data: query,
    });

    if ('SUCCESS' != result.return_code) {
      think.logger.error(`weixin createOrder fail 结果业务代码异常，返回结果：${JSON.stringify(result)}`);
      throw new WxPayError(`weixin createOrder fail`);
    }

    if (think.isTrueEmpty(result.prepay_id)) {
      think.logger.error(`weixin createOrder 无法获取prepay id，错误代码： '${result.err_code}'，信息：${result.err_code_des}。`);
      throw new WxPayError(`weixin createOrder 无法获取prepay id，错误代码： '${result.err_code}'，信息：${result.err_code_des}。`);
    }

    const data = {
      appId: result.appid,
      timeStamp: Math.floor((new Date()).getTime() / 1000.0).toString(),
      nonceStr: result.nonce_str,
      package: `prepay_id=${result.prepay_id}`,
      signType,
    };

    return Object.assign(data, {
      paySign: this.createSign(data, signType, signKey),
    });
  }

  /**
   * .
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
   * @param {object} order .
   * @returns {Promise<{prepayId: string}>}
   */
  async createOrderV3(order) {
    const config = think.config('weixin');

    const response = await this.request({
      method: 'post',
      url: 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Accept-Language': 'en',
        // 'User-Agent': '?',
      },
      data: {
        appid: config.appid,
        mchid: config.mchId,
        description: order.body,
        out_trade_no: order.outTradeNo,
        // time_expire: null,
        // attach: null,
        notify_url: config.notifyUrl,
        amount: {
          total: order.totalFee,
          currency: 'CNY',
          // payer_total: null,
          // payer_currency: null,
        },
        payer: {
          openid: order.openid,
        },
        // detail: null,
        // scene_info: null,
        // settle_info: null,
      },
    });

    return {
      prepayId: response.prepay_id,
    };
  }

  /**
   * 应用场景
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5
   * @param {{ outTradeNo: string, outRefundNo: string, totalFee: number, refundFee: number }} refund
   * @returns {Promise<object>}
   */
  async refund(refund) {
    const config = think.config('weixin');

    const tradeType = 'JSAPI';
    const signType = 'MD5';

    const query = {
      appid: config.appid,
      mch_id: config.mchId,
      notify_url: config.notifyUrl,
      //
      trade_type: tradeType,
      sign_type: signType,
      nonce_str: this.createNonceStr(),
      //
      out_trade_no: refund.outRefundNo,
      out_refund_no: refund.outRefundNo,
      total_fee: refund.totalFee,
      refund_fee: refund.refundFee,
    };

    const result = await this.requestXml({
      url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
      data: query,
    });

    if ('SUCCESS' != result.return_code) {
      think.logger.error(`weixin refund fail 结果业务代码异常，返回结果：${JSON.stringify(result)}`);
      throw new WxPayError(`weixin refund fail`);
    }

    {
      const coupons = [];
      if (!think.isEmpty(result.coupon_refund_count)) {
        for (let i = 0; i < result.coupon_refund_count; ++i) {
          coupons.push({
            id: result[`coupon_refund_id_${i}`],
            fee: result[`coupon_refund_fee_${i}`],
            type: result[`coupon_refund_type_${i}`],
          });
        }
      }
      result.refund_coupons = coupons;
    }

    {
      const refunds = [];
      if (!think.isEmpty(result.refund_count)) {
        for (let i = 0; i < result.refund_count; ++i) {
          refunds.push({
            id: result[`refund_id_${i}`],
            fee: result[`refund_fee_${i}`],
            status: result[`refund_status_${i}`],
          });
        }
      }
      result.refunds = refunds;
    }

    return Object.fromEntries(
      Object.entries(result)
        .map(([k, v]) => [think.camelCase(k), v])
    );
  }

  /**
   * .
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7
   * @param {object|string} xml .
   * @param {string?} signType .
   * @returns {object}
   */
  parseOrderNotifyResult(xml, signType = null) {
    try {
      think.logger.debug(`微信支付异步通知请求参数：${xml}`);

      const result = think.isString(xml)
        ? this.parseXml(xml)?.xml
        : xml;

      if (think.isNullOrUndefined(signType)) {
        if (!think.isNullOrUndefined(result.sign_type)) {
          signType = result.sign_type;
        } else {
          // Default
          signType = 'MD5';
        }
      }

      think.logger.debug(`微信支付异步通知请求解析后的对象：${JSON.stringify(result)}`);

      if ('SUCCESS' != result.return_code && think.isNullOrUndefined(result.sign)) {
        throw new WxPayError('伪造的通知！');
      }

      if (!think.isNullOrUndefined(result.sign) && !this.checkSign(result, signType, false)) {
        think.logger.debug(`校验结果签名失败，参数：${JSON.stringify(result)}`);
        throw new WxPayError('weixin parseOrderNotifyResult 参数格式校验错误！');
      }

      return Object.fromEntries(
        Object.entries(result)
          .map(([k, v]) => [think.camelCase(k), v])
      );
    } catch (e) {
      switch (true) {
        case e instanceof WxPayError:
          throw e;
        default:
          throw new WxPayError(`发生异常！`, { cause: e });
      }
    }
  }

  /**
   * .
   * @param {string} sessionKey .
   * @param {string} encryptedData .
   * @param {string} iv .
   * @returns {object}
   */
  getPhoneNoInfo(sessionKey, encryptedData, iv) {
    const decrypted = this.decrypt(sessionKey, encryptedData, iv);
    return JSON.parse(decrypted);
    // TODO
    // return {
    //   phoneNumber: '',
    //   purePhoneNumber: '',
    //   countryCode: '',
    //   watermark: {
    //     appid: '',
    //     timestamp: '',
    //   },
    // };
  }

  /**
   * .
   * @see https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=4_3
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=20_1
   * @param {object} params .
   * @param {string} signType 'HMAC-SHA256' or 'MD5'
   * @param {string} signKey .
   * @param {string[]} ignoredParams .
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

    const toSign = Object.entries(params)
      .filter(([key, value]) => (!think.isNullOrUndefined(value) && '' !== value && !ignoredParams.includes(key)))
      .sort(([k1, v1], [k2, v2]) => (k1 < k2) ? -1 : ((k1 > k2) ? 1 : 0))
      .concat([['key', signKey]])
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

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
   * .
   * @param {object} params .
   * @param {string} signType .
   * @param {string|false} signKey .
   * @returns {boolean}
   */
  checkSign(params, signType, signKey) {
    if (think.isNullOrUndefined(params.sign)) {
      return false;
    }
    return params.sign == this.createSign(params, signType, signKey);
  }

  /**
   * .
   * @param {string} sessionKey .
   * @param {string} encryptedData .
   * @param {string} ivStr .
   * @returns {string}
   */
  decrypt(sessionKey, encryptedData, ivStr) {
    try {
      const key = Buffer.from(sessionKey, 'base64').toString();
      const data = Buffer.from(encryptedData, 'base64').toString();
      const iv = Buffer.from(ivStr, 'base64').toString();
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(data);
      decrypted += decipher.final();
      return decrypted;
    } catch (e) {
      throw new Error('AES解密失败！', { cause: e });
    }
  }

  /**
   * @see https://github.com/Wechat-Group/WxJava/blob/cb34973efe26574da9027a8a39672fe8c38aea86/weixin-java-pay/src/main/java/com/github/binarywang/wxpay/bean/result/BaseWxPayResult.java#L126
   */
  fenToYuan(fen) {
    return (fen / 100.0).toFixed(2);
  }

  createNonceStr() {
    return (new Date()).getTime().toString();
  }

  buildXml(obj) {
    const builder = new XMLBuilder();
    return builder.build(obj);
  }

  parseXml(xml) {
    const parser = new XMLParser({
      parseTagValue: false,
    });
    return parser.parse(xml);
  }

  async requestXml(request) {
    const config = think.config('weixin');
    const signType = 'MD5';
    /** @type {string} */
    const signKey = config.mchKey;
    /** @type {object} */
    const query = request.data;

    Object.assign(query, {
      sign: this.createSign(query, signType, signKey),
    });

    const response = await this.request({
      method: 'post',
      url: request.url,
      data: this.buildXml({ xml: query }),
    });

    const result = this.parseXml(response)?.xml;

    if (!think.isObject(result)) {
      throw new WxPayError(`weixin XML parse error`);
    }

    if (!this.checkSign(result, signType, signKey)) {
      think.logger.debug(`校验结果签名失败，参数：${JSON.stringify(result)}`);
      throw new WxPayError('参数格式校验错误！');
    }

    return result;
  }

  async request(request) {
    const response = await axios(request);

    if (200 != response.status) {
      console.error(response.status);
      throw new Error(`weixin status: ${response.status}`);
    }

    if (!think.isEmpty(response.data.errcode)) {
      console.error(response.data);
      throw new Error(`weixin error ${response.data.errcode}: ${response.data.errmsg}`);
    }

    return response.data;
  }
};
