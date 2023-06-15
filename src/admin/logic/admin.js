const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    // this.requiresPermissions = 'admin:admin:list';
    this.allowMethods = 'GET';

    this.rules = {
      username: {
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
    // this.requiresPermissions = 'admin:admin:create';
    this.allowMethods = 'POST';

    this.rules = {
      username: {
        string: true,
        required: true,
      },
      password: {
        string: true,
        required: true,
        length: { min: 6 },
      },
      avatar: {
        string: true,
      },
      roleIds: {
        array: true,
        children: {
          int: true,
        },
      },
    };
  }

  readAction() {
    // this.requiresPermissions = 'admin:admin:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    // this.requiresPermissions = 'admin:admin:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      username: {
        string: true,
        required: true,
      },
      avatar: {
        string: true,
      },
      roleIds: {
        array: true,
        children: {
          int: true,
        },
      },
    };
  }

  deleteAction() {
    // this.requiresPermissions = 'admin:admin:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
