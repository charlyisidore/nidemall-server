const DATA = {
  name: 'my name',
  keywords: '',
  desc: 'my desc',
  pid: 0,
  iconUrl: 'http://example/icon.jpg',
  picUrl: 'http://example/image.jpg',
  level: 'L1',
  sortOrder: 1,
};

async function createCategory(data = {}) {
  const entity = { ...DATA, ...data };
  const id = await think.model('category').add(entity);

  return think.model('category')
    .where({ id })
    .find();
}

function destroyCategory(id) {
  return think.model('category')
    .where({ id })
    .delete();
}

module.exports = {
  createCategory,
  destroyCategory,
  DATA,
};
