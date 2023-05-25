// default config
module.exports = {
  workers: 1,
  validateDefaultErrno: 402,
  auth: {
    header: 'X-Litemall-Token',
    secret: 'yFHYEORzoiaUZvnVY32yTlkN',
    algorithm: 'HS256',
    expiresIn: '2h',
    audience: 'mp',
    issuer: 'nidemall',
    subject: 'nidemall auth token',
  },
  system: {
    prefix: 'litemall_',
  },
  weixin: {
    // 小程序 appId
    // The AppId of the Mini Program
    appid: '',
    // 小程序 appSecret
    // The appSecret of the Mini Program
    secret: '',
  },
  express: {
    enable: true,
    appid: '',
    appkey: '',
    url: 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
    vendors: [],
  },
};
