module.exports = class extends think.Logic {
  listAction() {
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

  detailAction() {
    this.allowMethods = 'GET';

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
    };
  }

  submitAction() {
    this.allowMethods = 'POST';

    this.rules = {
      type: {
        int: true,
        required: true,
      },
      amount: {
        number: true,
        required: true,
      },
      reason: {
        string: true,
        required: true,
      },
    };
  }
};
