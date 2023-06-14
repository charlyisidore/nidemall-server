const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      name: {
        string: true,
      },
      type: {
        int: true,
      },
      status: {
        int: true,
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

  listuserAction() {
    this.allowMethods = 'GET';

    this.rules = {
      userId: {
        int: true,
      },
      couponId: {
        int: true,
      },
      status: {
        int: true,
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
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      desc: {
        string: true,
      },
      tag: {
        string: true,
      },
      min: {
        float: true,
      },
      discount: {
        float: true,
      },
      limit: {
        int: true,
      },
      type: {
        int: true,
      },
      total: {
        int: true,
      },
      timeType: {
        int: true,
      },
      days: {
        int: true,
      },
      startTime: {
        date: true,
      },
      endTime: {
        date: true,
      },
      goodsType: {
        int: true,
      },
      goodsValue: {
        array: true,
        children: {
          int: true,
        },
      },
    };
  }

  readAction() {
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
      name: {
        string: true,
        required: true,
      },
      desc: {
        string: true,
      },
      tag: {
        string: true,
      },
      min: {
        float: true,
      },
      discount: {
        float: true,
      },
      limit: {
        int: true,
      },
      type: {
        int: true,
      },
      total: {
        int: true,
      },
      timeType: {
        int: true,
      },
      days: {
        int: true,
      },
      startTime: {
        date: true,
      },
      endTime: {
        date: true,
      },
      goodsType: {
        int: true,
      },
      goodsValue: {
        array: true,
        children: {
          int: true,
        },
      },
    };
  }

  deleteAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
