module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';
  }

  helperAction() {
    this.allowMethods = 'GET';

    this.rules = {
      keyword: {
        string: true,
        required: true,
      },
      page: {
        int: true,
        default: 1,
      },
      limit: {
        int: true,
        default: 10,
      },
    };
  }

  clearhistoryAction() {
    this.allowMethods = 'POST';
  }
};
