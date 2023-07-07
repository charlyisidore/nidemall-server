const Base = require('./base.js');

module.exports = class AdminIndexController extends Base {
  indexAction() {
    return this.success('ok');
  }
};
