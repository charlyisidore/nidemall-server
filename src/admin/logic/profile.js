module.exports = class extends think.Logic {
  passwordAction() {
    this.allowMethods = 'POST';
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
  }

  bcatnoticeAction() {
    this.allowMethods = 'POST';
  }

  rmnoticeAction() {
    this.allowMethods = 'POST';
  }

  brmnoticeAction() {
    this.allowMethods = 'POST';
  }
};
