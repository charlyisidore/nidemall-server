const DATA = {
  name: 'my name',
  tel: '13456789012',
  province: 'my province',
  city: 'my city',
  county: 'my county',
  areaCode: '123456',
  addressDetail: 'my address detail',
  isDefault: true,
};

async function createAddress(data = {}) {
  const now = think.datetime(new Date());
  const entity = {
    addTime: now,
    updateTime: now,
    ...DATA,
    ...data,
  };
  const id = await think.model('address').add(entity);

  return think.model('address')
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
  DATA,
};
