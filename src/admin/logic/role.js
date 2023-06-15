const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    // this.requiresPermissions = 'admin:role:list';
    this.allowMethods = 'GET';

    this.rules = {
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

  optionsAction() {
    this.allowMethods = 'GET';
  }

  readAction() {
    // this.requiresPermissions = 'admin:role:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  createAction() {
    // this.requiresPermissions = 'admin:role:create';
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      desc: {
        string: true,
      },
    };
  }

  updateAction() {
    // this.requiresPermissions = 'admin:role:update';
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
      },
    };
  }

  deleteAction() {
    // this.requiresPermissions = 'admin:role:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  permissionsAction() {
    switch (true) {
      case this.isGet:
        // this.requiresPermissions = 'admin:role:permission:get';
        break;
      case this.isPost:
        // this.requiresPermissions = 'admin:role:permission:update';
        break;
    }

    this.allowMethods = 'GET,POST';

    this.rules = {
      roleId: {
        int: true,
      },
      permissions: {
        array: true,
        children: {
          string: true,
        },
      },
    };
  }
};
