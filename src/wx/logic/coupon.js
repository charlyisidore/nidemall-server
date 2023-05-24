module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      page: {
        int: true,
        default: 1,
      },
      limit: {
        int: true,
        default: 10,
      },
      sort: {
        string: true,
        default: 'add_time',
      },
      order: {
        string: true,
        default: 'desc',
      },
    };
  }

  mylistAction() {
    this.allowMethods = 'GET';

    this.rules = {
      status: {
        int: true,
      },
      page: {
        int: true,
        default: 1,
      },
      limit: {
        int: true,
        default: 10,
      },
      sort: {
        string: true,
        default: 'add_time',
      },
      order: {
        string: true,
        default: 'desc',
      },
    };
  }

  selectlistAction() {
    this.allowMethods = 'GET';

    this.rules = {
      cartId: {
        int: true,
      },
      grouponRulesId: {
        int: true,
      },
    };
  }

  receiveAction() {
    this.allowMethods = 'POST';
  }

  exchangeAction() {
    this.allowMethods = 'POST';
  }
};
