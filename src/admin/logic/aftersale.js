module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      orderId: {
        int: true,
      },
      aftersaleSn: {
        string: true,
      },
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

  receptAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  ['batch-receptAction']() {
    this.allowMethods = 'POST';

    this.rules = {
      ids: {
        array: true,
        required: true,
        children: {
          int: true,
        },
      },
    };
  }

  rejectAction() {
    this.allowMethods = 'POST';
  }

  ['batch-rejectAction']() {
    this.allowMethods = 'POST';
  }

  refundAction() {
    this.allowMethods = 'POST';
  }
};
