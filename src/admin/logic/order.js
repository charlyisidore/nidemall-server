module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      nickname: {
        string: true,
      },
      consignee: {
        string: true,
      },
      orderSn: {
        string: true,
      },
      start: {
        date: true,
      },
      end: {
        date: true,
      },
      orderStatusArray: {
        array: true,
        children: {
          int: true,
        },
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

  channelAction() {
    this.allowMethods = 'GET';
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

  refundAction() {
    this.allowMethods = 'POST';
  }

  shipAction() {
    this.allowMethods = 'POST';
  }

  payAction() {
    this.allowMethods = 'POST';
  }

  deleteAction() {
    this.allowMethods = 'POST';
  }

  replyAction() {
    this.allowMethods = 'POST';
  }
};
