const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
      },
    };
  }

  allAction() {
    this.allowMethods = 'GET';
  }

  currentAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
