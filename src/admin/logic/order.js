const Base = require('./base.js');

module.exports = class extends Base {
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

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
      refundMoney: {
        float: true,
        required: true,
      },
    };
  }

  shipAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
      shipSn: {
        string: true,
        required: true,
      },
      shipChannel: {
        string: true,
        required: true,
      },
    };
  }

  payAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
      newMoney: {
        float: true,
        required: true,
      },
    };
  }

  deleteAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
    };
  }

  replyAction() {
    this.allowMethods = 'POST';

    this.rules = {
      commentId: {
        int: true,
        required: true,
      },
      content: {
        string: true,
        required: true,
      },
    };
  }
};
