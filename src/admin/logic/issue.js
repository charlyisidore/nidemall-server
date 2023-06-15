const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    // this.requiresPermissions = 'admin:issue:list';
    this.allowMethods = 'GET';

    this.rules = {
      question: {
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
    // this.requiresPermissions = 'admin:issue:create';
    this.allowMethods = 'POST';

    this.rules = {
      question: {
        string: true,
        required: true,
      },
      answer: {
        string: true,
        required: true,
      },
    };
  }

  readAction() {
    // this.requiresPermissions = 'admin:issue:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    // this.requiresPermissions = 'admin:issue:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      question: {
        string: true,
        required: true,
      },
      answer: {
        string: true,
        required: true,
      },
    };
  }

  deleteAction() {
    // this.requiresPermissions = 'admin:issue:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
