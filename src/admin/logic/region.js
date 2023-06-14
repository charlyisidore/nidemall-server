const Base = require('./base.js');

module.exports = class extends Base {
  clistAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  listAction() {
    this.allowMethods = 'GET';
  }
};
