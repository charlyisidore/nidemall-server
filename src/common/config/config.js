// default config
module.exports = {
  workers: 1,
  auth: {
    header: 'X-Nidemall-Token',
    secret: 'yFHYEORzoiaUZvnVY32yTlkN',
    algorithm: 'HS256',
    expiresIn: '2h',
    audience: 'mp',
    issuer: 'nidemall',
    subject: 'nidemall auth token',
  },
  weixin: {
    // 小程序 appId
    // The AppId of the Mini Program
    appid: '',
    // 小程序 appSecret
    // The appSecret of the Mini Program
    secret: '',
  }
};
