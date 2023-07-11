const Base = require('./base.js');

module.exports = class extends Base {
  uploadAction() {
    this.allowMethods = 'POST';

    this.rules = {
      file: {
        method: 'FILE',
        image: true,
        required: true,
      },
    };
  }
};
