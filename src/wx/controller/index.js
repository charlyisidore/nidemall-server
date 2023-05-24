const Base = require('./base.js');

module.exports = class WxIndexController extends Base {
  indexAction() {
    return this.success('ok');
  }
};
