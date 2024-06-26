const Base = require('./base.js');

module.exports = class KeywordService extends Base {
  /**
   * .
   * @returns {Promise<Keyword|Record<string, never>>}
   */
  async queryDefault() {
    return this.model('keyword')
      .where({
        isDefault: true,
        deleted: false,
      })
      .find();
  }

  /**
   * .
   * @returns {Promise<Keyword[]>}
   */
  async queryHots() {
    return this.model('keyword')
      .where({
        isHot: true,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {string} keyword .
   * @param {number} page .
   * @param {number} limit .
   * @returns {Promise<Keyword[]>}
   */
  async queryByKeyword(keyword, page, limit) {
    return this.model('keyword')
      .field('keyword')
      .distinct('keyword')
      .where({
        keyword: ['LIKE', `%${keyword}%`],
        deleted: false,
      })
      .page(page, limit)
      .select();
  }

  /**
   * .
   * @param {string?} keyword .
   * @param {string?} url .
   * @param {number} page .
   * @param {number} limit .
   * @param {string?} sort .
   * @param {string?} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Keyword[]}>}
   */
  async querySelective(keyword, url, page, limit, sort, order) {
    const model = this.model('keyword');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(keyword)) {
      Object.assign(where, {
        keyword: ['LIKE', `%${keyword}%`],
      });
    }

    if (!think.isTrueEmpty(url)) {
      Object.assign(where, {
        url: ['LIKE', `%${url}%`],
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
   * .
   * @param {Keyword} keyword .
   * @returns {Promise<number>} The ID inserted
   */
  async add(keyword) {
    const now = new Date();
    return this.model('keyword')
      .add(Object.assign(keyword, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<Keyword|Record<string, never>>}
   */
  async findById(id) {
    return this.model('keyword')
      .where({ id })
      .find();
  }

  /**
   * .
   * @param {Keyword} keyword .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(keyword) {
    const now = new Date();
    return this.model('keyword')
      .where({
        id: keyword.id,
      })
      .update(Object.assign(keyword, {
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('keyword')
      .where({ id })
      .update({
        deleted: true,
      });
  }
};
