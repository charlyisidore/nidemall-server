const { createGoodsProduct, destroyGoodsProduct } = require('../helpers/goods_product.js');
const { createUser, destroyUser } = require('../../helpers/app.js');

const DATA = {
  userId: 0,
  goodsId: 0,
  goodsSn: 'GOODSSN',
  goodsName: 'Some goods',
  productId: 0,
  price: 1.0,
  number: 1,
  specifications: ['spec1'],
  checked: true,
  picUrl: 'https://picsum.photos/100',
  deleted: false,
};

async function createCart(data = {}) {
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

  if (!entity.productId || 0 === entity.productId) {
    const product = await createGoodsProduct();
    const goods = await think.model('goods').where({ id: product.goodsId }).find();
    entity.goodsId = product.goodsId;
    entity.goodsSn = goods.goodsSn;
    entity.goodsName = goods.goodsSn;
    entity.picUrl = goods.picUrl;
    entity.productId = product.id;
    entity.price = product.price;
    entity.specifications = product.specifications;
  }

  const id = await think.model('cart').add(entity);

  return think.model('cart')
    .where({ id })
    .find();
}

async function destroyCart(id) {
  const cart = think.model('cart')
    .where({ id })
    .find();

  await destroyGoodsProduct(cart.productId);

  return think.model('cart')
    .where({ id })
    .delete();
}

module.exports = {
  createCart,
  destroyCart,
  DATA,
};
