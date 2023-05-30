module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
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

  detailAction() {
    this.allowMethods = 'GET';

    this.rules = {
      grouponId: {
        int: true,
        required: true,
      },
    };
  }

  joinAction() {
    this.allowMethods = 'GET';

    this.rules = {
      grouponId: {
        int: true,
        required: true,
      },
    };
  }

  myAction() {
    this.allowMethods = 'GET';

    this.rules = {
      showType: {
        int: true,
        default: 0,
      },
    };
  }
};
