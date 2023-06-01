const DATA = {
  name: 'my name',
  tel: '13945678911',
  province: 'my province',
  city: 'my city',
  county: 'my county',
  areaCode: '123456',
  addressDetail: 'my address detail',
  isDefault: false,
};

async function createAddress(data = {}) {
  const entity = { ...DATA, ...data };
  const id = await think.model('address').add(entity);

  return await think.model('address')
    .where({ id })
    .find();
}

function destroyAddress(id) {
  return think.model('address')
    .where({ id })
    .delete();
}

module.exports = {
  createAddress,
  destroyAddress,
};