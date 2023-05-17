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
    const config = this.config('auth');

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
      return null;
    }
  }

  /**
   * 
   * @param {string} token 
   */
  verifyToken(token) {
    const config = this.config('auth');

    if (!token) {
      return null;
    }

    try {
      return jwt.verify(token, config.secret);
    } catch (e) {
      return null;
    }
  }
}