module.exports = class extends think.Logic {
  passwordAction() {
    this.allowMethods = 'POST';

    this.rules = {
      oldPassword: {
        string: true,
        required: true,
      },
      newPassword: {
        string: true,
        required: true,
      },
    };
  }

  nnoticeAction() {
    this.allowMethods = 'GET';
  }

  lsnoticeAction() {
    this.allowMethods = 'GET';

    this.rules = {
      title: {
        string: true,
      },
      type: {
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

  catnoticeAction() {
    this.allowMethods = 'POST';

    this.rules = {
      noticeId: {
        int: true,
        required: true,
      },
    };
  }

  bcatnoticeAction() {
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

  rmnoticeAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  brmnoticeAction() {
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
