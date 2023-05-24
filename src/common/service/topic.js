module.exports = class TopicService extends think.Service {
  static FIELDS = [
    'id',
    'title',
    'subtitle',
    'price',
    'picUrl',
    'readCount',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  queryList(page, limit, sort = 'addTime', order = 'DESC') {
    return this.model('topic')
      .field(this.constructor.FIELDS)
      .where({
        deleted: false,
      })
      .order({
        [sort]: order,
        id: 'ASC',
      })
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('topic')
      .where({
        id,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} id 
   * @param {number} page 
   * @param {number} limit 
   */
  async queryRelatedList(id, page, limit) {
    const topics = await this.model('topic')
      .where({
        id,
        deleted: false,
      })
      .select();

    if (think.isEmpty(topics)) {
      return this.queryList(page, limit, 'addTime', 'DESC');
    }

    const topic = topics[0];

    const relateds = await this.model('topic')
      .where({
        id: ['!=', topic.id],
        deleted: false,
      })
      .page(page, limit)
      .countSelect();

    if (!think.isEmpty(relateds)) {
      return relateds;
    }

    return this.queryList(page, limit, 'addTime', 'DESC');
  }
}