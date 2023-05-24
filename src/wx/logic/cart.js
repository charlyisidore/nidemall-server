module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';
  }

  addAction() {
    this.allowMethods = 'POST';

    this.rules = {
      goodsId: {
        int: true,
        required: true,
      },
      productId: {
        int: true,
        required: true,
      },
      number: {
        int: true,
        required: true,
      },
    };
  }

  fastaddAction() {
    this.allowMethods = 'POST';

    this.rules = {
      goodsId: {
        int: true,
        required: true,
      },
      productId: {
        int: true,
        required: true,
      },
      number: {
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
      goodsId: {
        int: true,
        required: true,
      },
      productId: {
        int: true,
        required: true,
      },
      number: {
        int: true,
        required: true,
      },
    };
  }

  checkedAction() {
    this.allowMethods = 'POST';

    this.rules = {
      productIds: {
        array: true,
        required: true,
        children: {
          int: true,
        },
      },
      isChecked: {
        boolean: true,
        required: true,
      },
    };
  }

  deleteAction() {
    this.allowMethods = 'POST';

    this.rules = {
      productIds: {
        array: true,
        required: true,
        children: {
          int: true,
        },
      },
    };
  }

  goodscountAction() {
    this.allowMethods = 'GET';
  }

  checkoutAction() {
    this.allowMethods = 'GET';

    this.rules = {
      cartId: {
        int: true,
      },
      addressId: {
        int: true,
      },
      couponId: {
        int: true,
      },
      userCouponId: {
        int: true,
      },
      grouponRulesId: {
        int: true,
      },
    };
  }
};
