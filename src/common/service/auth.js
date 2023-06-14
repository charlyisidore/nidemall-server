const Base = require('./base.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class AuthService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<string>}
   */
  createToken(userId) {
    return new Promise((resolve) => {
      const config = think.config('auth');

      const options = {
        algorithm: config.algorithm,
        expiresIn: config.expiresIn,
        audience: config.audience,
        issuer: config.issuer,
        subject: config.subject,
      };

      jwt.sign({ userId }, config.secret, options, (err, token) => {
        if (err) {
          console.error(e);
          return resolve(null);
        }
        resolve(token);
      });
    });
  }

  /**
   * 
   * @param {string} token 
   */
  verifyToken(token) {
    return new Promise((resolve) => {
      const config = think.config('auth');

      if (!token) {
        return resolve(null);
      }

      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          console.error(e);
          return resolve(null);
        }
        resolve(decoded);
      });
    });
  }

  /**
   * 
   * @param {string} password 
   * @param {string} hash 
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * 
   * @param {string} password 
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @param {string} code 
   * @returns {Promise<boolean>}
   */
  async addCaptchaToCache(phoneNumber, code) {
    let cache = await think.cache('captcha') || {};
    const now = (new Date()).getTime();

    if (phoneNumber in cache && cache[phoneNumber].expireTime > now) {
      return false;
    }

    cache[phoneNumber] = {
      code,
      expireTime: now + 60 * 1000,
    };

    await think.cache('captcha', cache);
    return true;
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @returns {Promise<string|null>}
   */
  async getCachedCaptcha(phoneNumber) {
    let cache = await think.cache('captcha') || {};

    if (!(phoneNumber in cache)) {
      return null;
    }

    const now = (new Date()).getTime();

    if (cache[phoneNumber].expireTime < now) {
      return null;
    }

    return cache[phoneNumber].code;
  }

  /**
   * 
   */
  async cleanCaptchaCache() {
    let cache = await think.cache('captcha') || {};
    const now = (new Date()).getTime();

    cache = Object.fromEntries(
      Object.entries(cache)
        .filter(([k, v]) => v.expireTime < now)
    );

    await think.cache('captcha', cache);
  }

  getConstants() {
    return {
      RESPONSE: {
        INVALID_ACCOUNT: 700,
        CAPTCHA_UNSUPPORT: 701,
        CAPTCHA_FREQUENCY: 702,
        CAPTCHA_UNMATCH: 703,
        NAME_REGISTERED: 704,
        MOBILE_REGISTERED: 705,
        MOBILE_UNREGISTERED: 706,
        INVALID_MOBILE: 707,
        OPENID_UNACCESS: 708,
        OPENID_BINDED: 709,
      },
    };
  }
}
