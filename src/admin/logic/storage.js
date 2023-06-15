const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:storage:list';
    this.allowMethods = 'GET';

    this.rules = {
      key: {
        string: true,
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
    this.requiresPermissions = 'admin:storage:create';
    this.allowMethods = 'POST';

    this.rules = {
      file: {
        method: 'FILE',
        required: true,
      },
    };
  }

  readAction() {
    this.requiresPermissions = 'admin:storage:read';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.requiresPermissions = 'admin:storage:update';
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
    };
  }

  deleteAction() {
    this.requiresPermissions = 'admin:storage:delete';
    this.allowMethods = 'POST';

    this.rules = {
      key: {
        string: true,
        required: true,
      },
    };
  }
};
