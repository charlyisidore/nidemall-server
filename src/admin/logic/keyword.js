const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:keyword:list';
    this.allowMethods = 'GET';

    this.rules = {
      keyword: {
        string: true,
      },
      url: {
        string: true,
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

  createAction() {
    this.requiresPermissions = 'admin:keyword:create';
    this.allowMethods = 'POST';

    this.rules = {
      keyword: {
        string: true,
        required: true,
      },
      url: {
        string: true,
      },
      isHot: {
        boolean: true,
      },
      isDefault: {
        boolean: true,
      },
    };
  }

  readAction() {
    this.requiresPermissions = 'admin:keyword:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.requiresPermissions = 'admin:keyword:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      keyword: {
        string: true,
        required: true,
      },
      url: {
        string: true,
      },
      isHot: {
        boolean: true,
      },
      isDefault: {
        boolean: true,
      },
    };
  }

  deleteAction() {
    this.requiresPermissions = 'admin:keyword:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
