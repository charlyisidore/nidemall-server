const DATA = {
  name: 'my name',
  desc: 'my desc',
  picUrl: 'http://example/image.jpg',
  sortOrder: 1,
  floorPrice: 1,
};

async function createBrand(data = {}) {
  const now = new Date();
  const entity = {
    addTime: think.datetime(now),
    updateTime: think.datetime(now),
    ...DATA,
    ...data,
  };
  const id = await think.model('brand').add(entity);

  return think.model('brand')
    .where({ id })
    .find();
}

function destroyBrand(id) {
  return think.model('brand')
    .where({ id })
    .delete();
}

module.exports = {
  createBrand,
  destroyBrand,
  DATA,
};
