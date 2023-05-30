module.exports = class extends think.Logic {
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
