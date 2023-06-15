const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:brand:list';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
      },
      name: {
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
    this.requiresPermissions = 'admin:brand:create';
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      desc: {
        string: true,
        required: true,
      },
      picUrl: {
        string: true,
      },
      floorPrice: {
        float: true,
        required: true,
      },
    };
  }

  readAction() {
    this.requiresPermissions = 'admin:brand:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.requiresPermissions = 'admin:brand:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      name: {
        string: true,
        required: true,
      },
      desc: {
        string: true,
        required: true,
      },
      picUrl: {
        string: true,
      },
      floorPrice: {
        float: true,
        required: true,
      },
    };
  }

  deleteAction() {
    this.requiresPermissions = 'admin:brand:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
