module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      showType: {
        int: true,
        default: 0,
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
      orderId: {
        int: true,
        required: true,
      },
    };
  }

  submitAction() {
    this.allowMethods = 'POST';

    this.rules = {
      cartId: {
        int: true,
        required: true,
      },
      addressId: {
        int: true,
        required: true,
      },
      couponId: {
        int: true,
        required: true,
      },
      userCouponId: {
        int: true,
      },
      message: {
        string: true,
      },
      grouponRulesId: {
        int: true,
      },
      grouponLinkId: {
        int: true,
      },
    };
  }

  cancelAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
    };
  }

  prepayAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderId: {
        int: true,
        required: true,
      },
    };
  }

  ['pay-notifyAction']() {
    this.allowMethods = 'POST';

    this.rules = {
      xml: {
        string: true,
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
    };
  }

  confirmAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderId: {
        int: true,
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

  goodsAction() {
    this.allowMethods = 'GET';

    this.rules = {
      ogid: {
        int: true,
        required: true,
      },
    };
  }

  commentAction() {
    this.allowMethods = 'POST';

    this.rules = {
      orderGoodsId: {
        int: true,
        required: true,
      },
      content: {
        string: true,
        required: true,
      },
      star: {
        int: true,
        required: true,
      },
      hasPicture: {
        boolean: true,
        default: false,
      },
      picUrls: {
        array: true,
        default: [],
        children: {
          string: true,
        },
      },
    };
  }
};
