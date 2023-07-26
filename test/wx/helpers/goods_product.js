const { createGoods, destroyGoods } = require('../helpers/goods.js');

const DATA = {
  goodsId: 0,
  specifications: ['spec1'],
  price: 1.0,
  number: 100,
  url: '',
  deleted: false,
};

async function createGoodsProduct(data = {}) {
  const now = think.datetime(new Date());
  const entity = {
    addTime: now,
    updateTime: now,
    ...DATA,
    ...data,
  };

  if (!entity.goodsId || 0 === entity.goodsId) {
    const goods = await createGoods();
    entity.goodsId = goods.id;
  }

  const id = await think.model('goods_product').add(entity);

  return think.model('goods_product')
    .where({ id })
    .find();
}

async function destroyGoodsProduct(id) {
  const goodsProduct = think.model('goods_product')
    .where({ id })
    .find();

  await destroyGoods(goodsProduct.goodsId);

  return think.model('goods_product')
    .where({ id })
    .delete();
}

module.exports = {
  createGoodsProduct,
  destroyGoodsProduct,
  DATA,
};
