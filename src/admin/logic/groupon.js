const Base = require('./base.js');

module.exports = class extends Base {
  listRecordAction() {
    this.requiresPermissions = 'admin:groupon:read';
    this.allowMethods = 'GET';

    this.rules = {
      grouponRuleId: {
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

  listAction() {
    this.requiresPermissions = 'admin:groupon:list';
    this.allowMethods = 'GET';

    this.rules = {
      goodsId: {
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

  updateAction() {
    this.requiresPermissions = 'admin:groupon:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      goodsId: {
        int: true,
        required: true,
      },
      discount: {
        float: true,
        required: true,
      },
      discountMember: {
        int: true,
        required: true,
      },
      expireTime: {
        date: true,
        required: true,
      },
    };
  }

  createAction() {
    this.requiresPermissions = 'admin:groupon:create';
    this.allowMethods = 'POST';

    this.rules = {
      goodsId: {
        int: true,
        required: true,
      },
      discount: {
        float: true,
        required: true,
      },
      discountMember: {
        int: true,
        required: true,
      },
      expireTime: {
        date: true,
        required: true,
      },
    };
  }

  deleteAction() {
    this.requiresPermissions = 'admin:groupon:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
