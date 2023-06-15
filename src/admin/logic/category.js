const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:category:list';
    this.allowMethods = 'GET';
  }

  createAction() {
    this.requiresPermissions = 'admin:category:create';
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      keywords: {
        string: true,
      },
      level: {
        string: true,
        required: true,
      },
      pid: {
        int: true,
      },
      iconUrl: {
        string: true,
      },
      picUrl: {
        string: true,
      },
      desc: {
        string: true,
      },
    };
  }

  readAction() {
    this.requiresPermissions = 'admin:category:read';
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.requiresPermissions = 'admin:category:update';
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
      keywords: {
        string: true,
      },
      level: {
        string: true,
        required: true,
      },
      pid: {
        int: true,
      },
      iconUrl: {
        string: true,
      },
      picUrl: {
        string: true,
      },
      desc: {
        string: true,
      },
    };
  }

  deleteAction() {
    this.requiresPermissions = 'admin:category:delete';
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  l1Action() {
    this.requiresPermissions = 'admin:category:list';
    this.allowMethods = 'GET';
  }
};
