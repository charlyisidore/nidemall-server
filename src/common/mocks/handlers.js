/** @see https://mswjs.io/docs/getting-started/mocks/rest-api */

const { rest } = require('msw');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');
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

function parseXml(text) {
  const parser = new XMLParser();
  return parser.parse(text);
}

function buildXml(obj) {
  const builder = new XMLBuilder();
  return builder.build(obj);
}

exports.handlers = [
  // https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_1
  rest.post('https://api.mch.weixin.qq.com/pay/unifiedorder', async (req, res, ctx) => {
    /** @type {WeixinService} */
    const weixinService = think.service('weixin');
    const signKey = think.config('weixin.mchKey');

    const query = parseXml(await req.text())?.xml ?? {};

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

    const body = buildXml({ xml: result });

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

    const query = parseXml(await req.text())?.xml ?? {};

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

    const body = buildXml({ xml: result });

    return res(
      ctx.status(200),
      ctx.xml(body)
    );
  }),
];
