// default config
module.exports = {
  workers: 1,
  validateDefaultErrno: 402,
  auth: {
    header: 'X-Litemall-Token',
    secret: '$ecretf0rt3st',
    algorithm: 'HS256',
    expiresIn: '2h',
    audience: 'mp',
    issuer: 'nidemall',
    subject: 'nidemall auth token',
  },
  storage: {
    type: 'local',
    local: {
      path: 'www/static/upload',
      baseUrl: 'http://127.0.0.1:8360/static/upload/',
    },
  },
  system: {
    prefix: 'litemall_',
  },
  weixin: {
    appid: 'wx8888888888888888',
    secret: '$ecretf0rt3st',
    mchId: '1900000109',
    mchKey: '$ecretf0rt3st',
    notifyUrl: 'http://127.0.0.1:8360/wx/order/pay-notify',
  },
  express: {
    enable: true,
    appid: '',
    appkey: '',
    url: 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
    vendors: [
      { code: 'ZTO', name: '中通快递' },
      { code: 'YTO', name: '圆通速递' },
      { code: 'YD', name: '韵达速递' },
      { code: 'YZPY', name: '邮政快递包裹' },
      { code: 'EMS', name: 'EMS' },
      { code: 'DBL', name: '德邦快递' },
      { code: 'FAST', name: '快捷快递' },
      { code: 'ZJS', name: '宅急送' },
      { code: 'TNT', name: 'TNT快递' },
      { code: 'UPS', name: 'UPS' },
      { code: 'DHL', name: 'DHL' },
      { code: 'FEDEX', name: 'FEDEX联邦(国内件)' },
      { code: 'FEDEX_GJ', name: 'FEDEX联邦(国际件)' },
    ],
  },
  mocks: false,
};
