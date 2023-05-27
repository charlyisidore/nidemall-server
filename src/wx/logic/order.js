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
  }

  prepayAction() {
    this.allowMethods = 'POST';
  }

  refundAction() {
    this.allowMethods = 'POST';
  }

  confirmAction() {
    this.allowMethods = 'POST';
  }

  deleteAction() {
    this.allowMethods = 'POST';
  }

  goodsAction() {
    this.allowMethods = 'GET';
  }

  commentAction() {
    this.allowMethods = 'POST';
  }
};
