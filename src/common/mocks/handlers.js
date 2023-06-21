/** @see https://mswjs.io/docs/getting-started/mocks/rest-api */

const { rest } = require('msw');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const crypto = require('node:crypto');

function randomHex(n) {
  return crypto.randomBytes(n).toString('hex');
}

function randomNum(n) {
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
  const num = randomNum(10);
  return `wx${year}${month}${day}${hours}${minutes}${seconds}${hex}${num}`;
}

function randomNonceStr() {
  return (new Date()).getTime().toString();
}

exports.handlers = [
  rest.post('https://api.mch.weixin.qq.com/pay/unifiedorder', async (req, res, ctx) => {
    /** @type {WeixinService} */
    const weixinService = think.service('weixin');
    const signKey = think.config('weixin.mchKey');

    const parser = new XMLParser();
    const query = parser.parse(await req.text())?.xml ?? {};

    console.log(query);
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

    const builder = new XMLBuilder();
    const body = builder.build({ xml: result });

    return res(
      ctx.status(200),
      ctx.xml(body)
    );
  }),
];
