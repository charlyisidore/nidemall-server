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
  comparePassword(password, hash) {
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
}