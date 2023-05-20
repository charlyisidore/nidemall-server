const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   */
  createToken(userId) {
    const config = think.config('auth');

    const options = {
      algorithm: config.algorithm,
      expiresIn: config.expiresIn,
      audience: config.audience,
      issuer: config.issuer,
      subject: config.subject,
    };

    try {
      return jwt.sign({ userId }, config.secret, options);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * 
   * @param {string} token 
   */
  verifyToken(token) {
    const config = think.config('auth');

    if (!token) {
      return null;
    }

    try {
      return jwt.verify(token, config.secret);
    } catch (e) {
      return null;
    }
  }

  /**
   * 
   * @param {string} password 
   * @param {string} hash 
   */
  comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * 
   * @param {string} password 
   */
  hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }
}