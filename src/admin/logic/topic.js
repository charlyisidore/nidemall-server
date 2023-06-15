const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    // this.requiresPermissions = 'admin:topic:list';
    this.allowMethods = 'GET';

    this.rules = {
      title: {
        string: true,
      },
      subtitle: {
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
    // this.requiresPermissions = 'admin:topic:create';
    this.allowMethods = 'POST';

    this.rules = {
      title: {
        string: true,
        required: true,
      },
      subtitle: {
        string: true,
        required: true,
      },
      picUrl: {
        string: true,
      },
      content: {
        string: true,
        required: true,
      },
      price: {
        float: true,
        required: true,
      },
      readCount: {
        string: true,
      },
      goods: {
        array: true,
        children: {
          int: true,
        },
      },
    };
  }

  readAction() {
    // this.requiresPermissions = 'admin:topic:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    // this.requiresPermissions = 'admin:topic:update';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      title: {
        string: true,
        required: true,
      },
      subtitle: {
        string: true,
        required: true,
      },
      picUrl: {
        string: true,
      },
      content: {
        string: true,
        required: true,
      },
      price: {
        float: true,
        required: true,
      },
      readCount: {
        string: true,
      },
      goods: {
        array: true,
        children: {
          int: true,
        },
      },
    };
  }

  deleteAction() {
    // this.requiresPermissions = 'admin:topic:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  ['batch-deleteAction']() {
    // this.requiresPermissions = 'admin:topic:batch-delete';
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
