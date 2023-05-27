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
        in: ['add_time', 'id'],
        default: 'add_time',
      },
      order: {
        string: true,
        in: ['asc', 'desc'],
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
        in: ['add_time', 'id'],
        default: 'add_time',
      },
      order: {
        string: true,
        in: ['asc', 'desc'],
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

    this.rules = {
      couponId: {
        int: true,
        required: true,
      },
    };
  }

  exchangeAction() {
    this.allowMethods = 'POST';

    this.rules = {
      code: {
        string: true,
        required: true,
      },
    };
  }
};
