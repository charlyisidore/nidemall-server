const Base = require('./base.js');

module.exports = class extends Base {
  submitAction() {
    this.allowMethods = 'POST';

    this.rules = {
      content: {
        string: true,
        required: true,
      },
      feedType: {
        string: true,
        required: true,
      },
      hasPicture: {
        boolean: true,
        default: false,
      },
      picUrls: {
        array: true,
        default: [],
        children: {
          string: true,
        },
      },
      mobile: {
        string: true,
        mobile: 'zh-CN',
        required: true,
      },
    };
  }
};
