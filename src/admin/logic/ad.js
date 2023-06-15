const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:ad:list';
    this.allowMethods = 'GET';

    this.rules = {
      name: {
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
    this.requiresPermissions = 'admin:ad:create';
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      content: {
        string: true,
        required: true,
      },
      url: {
        string: true,
      },
      position: {
        int: true,
      },
      link: {
        string: true,
      },
      enabled: {
        boolean: true,
      },
    };
  }

  readAction() {
    this.requiresPermissions = 'admin:ad:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.requiresPermissions = 'admin:ad:update';
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
      content: {
        string: true,
        required: true,
      },
      url: {
        string: true,
      },
      position: {
        int: true,
      },
      link: {
        string: true,
      },
      enabled: {
        boolean: true,
      },
    };
  }

  deleteAction() {
    this.requiresPermissions = 'admin:ad:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
