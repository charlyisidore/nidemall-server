const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.requiresPermissions = 'admin:log:list';
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
};
