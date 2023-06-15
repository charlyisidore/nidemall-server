const DATA = {
  goodsSn: 'mygoodssn',
  name: 'my name',
  categoryId: 0,
  brandId: 0,
  gallery: [],
  keywords: '',
  brief: '',
  isOnSale: true,
  sortOrder: 1,
  picUrl: 'http://example/image.jpg',
  shareUrl: '',
  isNew: false,
  isHot: false,
  unit: null,
  counterPrice: 1.0,
  retailPrice: 1.0,
  detail: 'my detail',
};

async function createGoods(data = {}) {
  const entity = { ...DATA, ...data };
  const id = await think.model('goods').add(entity);

  return think.model('goods')
    .where({ id })
    .find();
}

function destroyGoods(id) {
  return think.model('goods')
    .where({ id })
    .delete();
}

module.exports = {
  createGoods,
  destroyGoods,
  DATA,
};
