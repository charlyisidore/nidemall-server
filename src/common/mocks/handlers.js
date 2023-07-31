/** @see https://mswjs.io/docs/getting-started/mocks/rest-api */

const { rest } = require('msw');
const axios = require('axios');
const crypto = require('node:crypto');

function randomHex(n) {
  return crypto.randomBytes(n).toString('hex');
}

function randomNumString(n) {
  return Math.floor(Math.random() * (Math.pow(10, n) - 1))
    .toString()
    .padStart(n, '0');
}

function randomPrepayId() {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (1 + now.getMonth()).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const hex = randomHex(5);
  const num = randomNumString(10);
  return `wx${year}${month}${day}${hours}${minutes}${seconds}${hex}${num}`;
}

function randomNonceStr() {
  return (new Date()).getTime().toString();
}

// https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7
async function payNotify(data, query) {
  /** @type {WeixinService} */
  const weixinService = think.service('weixin');
  const signKey = false; // think.config('weixin.mchKey');

  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (1 + now.getMonth()).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const result = {
    appid: data.appid ?? query.appid,
    attach: '支付测试',
    bank_type: 'CFT',
    fee_type: 'CNY',
    is_subscribe: 'Y',
    mch_id: data.mch_id ?? query.mch_id,
    nonce_str: randomNonceStr(),
    // openid: 'oUpF8uMEb4qRXf22hE3X68TekukE',
    out_trade_no: data.out_trade_no ?? query.out_trade_no ?? randomNumString(10),
    result_code: 'SUCCESS',
    return_code: 'SUCCESS',
    time_end: `${year}${month}${day}${hours}${minutes}${seconds}`,
    total_fee: query.total_fee,
    // coupon_fee: 0,
    // coupon_count: 0,
    // coupon_type: 'CASH',
    // coupon_id: 10000,
    trade_type: data.trade_type ?? query.trade_type ?? 'JSAPI',
    transaction_id: randomNumString(28),
  };

  Object.assign(result, {
    sign: weixinService.createSign(result, query.sign_type, signKey),
  });

  return axios({
    method: 'post',
    url: query.notify_url,
    headers: {
      'Content-Type': 'application/xml',
    },
    data: weixinService.buildXml({ xml: result }),
  });
}

exports.handlers = [
  rest.post('http://127.0.0.1:8360/*', async (req, res, ctx) => {
    return req.passthrough();
  }),
  // https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_1
  rest.post('https://api.mch.weixin.qq.com/pay/unifiedorder', async (req, res, ctx) => {
    /** @type {WeixinService} */
    const weixinService = think.service('weixin');
    const signKey = think.config('weixin.mchKey');

    const query = weixinService.parseXml(await req.text())?.xml ?? {};

    const result = {
      return_code: 'SUCCESS',
      return_msg: 'OK',
      appid: query.appid,
      mch_id: query.mch_id,
      nonce_str: randomNonceStr(),
      result_code: 'SUCCESS',
      prepay_id: randomPrepayId(),
      trade_type: query.trade_type,
    };

    Object.assign(result, {
      sign: weixinService.createSign(result, query.sign_type, signKey),
    });

    const body = weixinService.buildXml({ xml: result });

    setTimeout(() => payNotify(result, query), 100);

    return res(
      ctx.status(200),
      ctx.xml(body)
    );
  }),

  // https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5
  rest.post('https://api.mch.weixin.qq.com/secapi/pay/refund', async (req, res, ctx) => {
    /** @type {WeixinService} */
    const weixinService = think.service('weixin');
    const signKey = think.config('weixin.mchKey');

    const query = weixinService.parseXml(await req.text())?.xml ?? {};

    const result = {
      appid: query.appid,
      mch_id: query.mch_id,
      nonce_str: randomNonceStr(),
      out_trade_no: query.out_trade_no,
      refund_count: '1',
      refund_fee_0: '1',
      refund_id_0: randomNumString(28),
      refund_status_0: 'PROCESSING',
      result_code: 'SUCCESS',
      return_code: 'SUCCESS',
      return_msg: 'OK',
      cash_refund_fee: '90',
      transaction_id: randomNumString(28),
    };

    Object.assign(result, {
      sign: weixinService.createSign(result, query.sign_type, signKey),
    });

    const body = weixinService.buildXml({ xml: result });

    await payNotify(result, query);

    return res(
      ctx.status(200),
      ctx.xml(body)
    );
  }),
];
