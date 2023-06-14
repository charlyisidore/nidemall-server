const Base = require('./base.js');

module.exports = class TopicService extends Base {
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
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Topic[]}>}
   */
  async queryList(page, limit, sort = 'addTime', order = 'DESC') {
    return this.model('topic')
      .field(this.constructor.FIELDS)
      .where({
        deleted: false,
      })
      .order({
        [sort]: order,
      })
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Topic|Record<string, never>>} 
   */
  async findById(id) {
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
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Topic[]}>}
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

  /**
   * 
   * @param {string?} title 
   * @param {string?} subtitle 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Topic[]}>}
   */
  async querySelective(title, subtitle, page, limit, sort, order) {
    const model = this.model('topic');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(title)) {
      Object.assign(where, {
        title: ['LIKE', `%${title}%`],
      });
    }

    if (!think.isTrueEmpty(subtitle)) {
      Object.assign(where, {
        subtitle: ['LIKE', `%${subtitle}%`],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {Topic} topic 
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(topic) {
    const now = new Date();
    return this.model('topic')
      .where({
        id: topic.id,
      })
      .update(Object.assign(topic, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('topic')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Topic} topic 
   * @returns {Promise<number>} The ID inserted
   */
  async add(topic) {
    const now = new Date();
    return this.model('topic')
      .add(Object.assign(topic, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number[]} ids 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByIds(ids) {
    const now = new Date();
    return this.model('topic')
      .where({
        id: ['IN', ids],
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }
}
