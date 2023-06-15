const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:aftersale:list';
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
    this.requiresPermissions = 'admin:aftersale:recept';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  ['batch-receptAction']() {
    this.requiresPermissions = 'admin:aftersale:batch-recept';
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
    this.requiresPermissions = 'admin:aftersale:reject';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  ['batch-rejectAction']() {
    this.requiresPermissions = 'admin:aftersale:batch-reject';
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

  refundAction() {
    this.requiresPermissions = 'admin:aftersale:refund';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
