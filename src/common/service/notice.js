const Base = require('./base.js');

module.exports = class NoticeService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string?} title 
   * @param {string?} content 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Notice[]}>}
   */
  async querySelective(title, content, page, limit, sort, order) {
    const model = this.model('notice');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(title)) {
      Object.assign(where, {
        title: ['LIKE', `%${title}%`],
      });
    }

    if (!think.isTrueEmpty(content)) {
      Object.assign(where, {
        content: ['LIKE', `%${content}%`],
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
   * @param {Notice} notice 
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(notice) {
    const now = new Date();
    return this.model('notice')
      .where({
        id: notice.id,
      })
      .update(Object.assign(notice, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('notice')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Notice} notice 
   * @returns {Promise<number>} The ID inserted
   */
  async add(notice) {
    const now = new Date();
    return this.model('notice')
      .add(Object.assign(notice, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Notice|Record<string, never>>}
   */
  async findById(id) {
    return this.model('notice')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {number[]} ids 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByIds(ids) {
    const now = new Date();
    return this.model('notice')
      .where({
        id: ['IN', ids],
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  getConstants() {
    return {
      ADMIN_RESPONSE: {
        UPDATE_NOT_ALLOWED: 660,
      },
    };
  }
}
