module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      username: {
        string: true,
      },
      mobile: {
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

  detailAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      nickname: {
        string: true,
      },
      mobile: {
        string: true,
      },
      gender: {
        int: true,
      },
      userLevel: {
        int: true,
      },
      status: {
        int: true,
      },
    };
  }
};
