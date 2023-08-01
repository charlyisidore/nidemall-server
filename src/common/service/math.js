const Base = require('./base.js');

module.exports = class MathService extends Base {
  /**
   * Compare two float numbers with given precision.
   * @param {number} x
   * @param {number} y
   * @param {number?} eps Precision
   * @returns {number} -1, 0, or 1
   */
  compareFloat(x, y, eps) {
    x = parseFloat(x);
    y = parseFloat(y);
    eps ??= this.getEpsilon();
    return (Math.abs(x - y) <= eps)
      ? 0
      : ((x < y) ? -1 : 1);
  }

  /**
   * Check if two float numbers are equal with given precision.
   * @param {number} x
   * @param {number} y
   * @param {number?} eps Precision
   * @returns {boolean}
   */
  isFloatEqual(x, y, eps) {
    x = parseFloat(x);
    y = parseFloat(y);
    eps ??= this.getEpsilon();
    return Math.abs(x - y) <= eps;
  }

  /**
   * Check if `x` is strictly less than `y` with given precision.
   * @param {number} x
   * @param {number} y
   * @param {number?} eps Precision
   * @returns {boolean}
   */
  isFloatLessThan(x, y, eps) {
    x = parseFloat(x);
    y = parseFloat(y);
    eps ??= this.getEpsilon();
    return x + eps < y;
  }

  /**
   * Check if `x` is strictly greater than `y` with given precision.
   * @param {number} x
   * @param {number} y
   * @param {number?} eps Precision
   * @returns {boolean}
   */
  isFloatGreaterThan(x, y, eps) {
    x = parseFloat(x);
    y = parseFloat(y);
    eps ??= this.getEpsilon();
    return x > y + eps;
  }

  /**
   * Get the default float precision.
   * @returns {number}
   */
  getEpsilon() {
    return 0.001;
  }
};
