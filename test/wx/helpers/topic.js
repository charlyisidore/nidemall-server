const DATA = {
  title: 'my title',
  subtitle: 'my subtitle',
  content: 'my content',
  price: 1.0,
  readCount: '1k',
  picUrl: 'http://example/image.jpg',
  sortOrder: 1,
  goods: [],
};

async function createTopic(data = {}) {
  const entity = { ...DATA, ...data };
  const id = await think.model('topic').add(entity);

  return think.model('topic')
    .where({ id })
    .find();
}

function destroyTopic(id) {
  return think.model('topic')
    .where({ id })
    .delete();
}

module.exports = {
  createTopic,
  destroyTopic,
  DATA,
};
