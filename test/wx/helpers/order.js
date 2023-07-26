const { createUser, destroyUser } = require('../../helpers/app.js');

const DATA = {
  userId: 0,
  orderSn: '',
  orderStatus: 101,
  aftersaleStatus: 0,
  consignee: '',
  mobile: '',
  address: '',
  message: '',
  goodsPrice: 1.0,
  freightPrice: 1.0,
  couponPrice: 0.0,
  integralPrice: 0.0,
  grouponPrice: 0.0,
  orderPrice: 2.0,
  actualPrice: 2.0,
  payId: '',
  payTime: null,
  shipSn: '',
  shipChannel: '',
  shipTime: null,
  refundAmount: 0.0,
  refundType: '',
  refundContent: '',
  refundTime: null,
  confirmTime: null,
  comments: 0,
  endTime: null,
  deleted: false,
};

async function createOrder(data = {}) {
  const now = think.datetime(new Date());
  const entity = {
    addTime: now,
    updateTime: now,
    ...DATA,
    ...data,
  };

  if (!entity.userId || 0 === entity.userId) {
    const user = await createUser();
    entity.userId = user.id;
  }

  const id = await think.model('order').add(entity);

  return think.model('order')
    .where({ id })
    .find();
}

async function destroyOrder(id) {
  return think.model('order')
    .where({ id })
    .delete();
}

module.exports = {
  createOrder,
  destroyOrder,
  DATA,
};
