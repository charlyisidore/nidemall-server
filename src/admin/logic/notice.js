const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    // this.requiresPermissions = 'admin:notice:list';
    this.allowMethods = 'GET';

    this.rules = {
      title: {
        string: true,
      },
      content: {
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
    // this.requiresPermissions = 'admin:notice:create';
    this.allowMethods = 'POST';

    this.rules = {
      title: {
        string: true,
      },
      content: {
        string: true,
      },
    };
  }

  readAction() {
    // this.requiresPermissions = 'admin:notice:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    // this.requiresPermissions = 'admin:notice:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      title: {
        string: true,
      },
      content: {
        string: true,
      },
    };
  }

  deleteAction() {
    // this.requiresPermissions = 'admin:notice:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  ['batch-deleteAction']() {
    // this.requiresPermissions = 'admin:notice:batch-delete';
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
};
