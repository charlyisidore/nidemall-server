const Base = require('./base.js');

module.exports = class CommentService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Comment[]}>}
   */
  queryGoodsByGid(id, page, limit) {
    return this.model('comment')
      .where({
        valueId: id,
        type: 0,
        deleted: false,
      })
      .order({ addTime: 'DESC' })
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} type 
   * @param {number} valueId 
   * @param {number} showType 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Comment[]}>}
   */
  query(type, valueId, showType, page, limit) {
    if (![0, 1].includes(showType)) {
      throw new Error('showType不支持');
    }

    const where = {
      valueId,
      type,
      deleted: false,
    };

    if (1 == showType) {
      Object.assign(where, {
        hasPicture: true,
      });
    }

    return this.model('comment')
      .where(where)
      .order({
        addTime: 'DESC',
        id: 'ASC',
      })
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} type 
   * @param {number} valueId 
   * @param {number} showType 
   * @returns {Promise<number>} The total number
   */
  count(type, valueId, showType) {
    if (![0, 1].includes(showType)) {
      throw new Error('showType不支持');
    }

    const where = {
      valueId,
      type,
      deleted: false,
    };

    if (1 == showType) {
      Object.assign(where, {
        hasPicture: true,
      });
    }

    return this.model('comment')
      .where(where)
      .count();
  }

  /**
   * 
   * @param {Comment} comment 
   * @returns {Promise<number>} The ID inserted
   */
  save(comment) {
    const now = new Date();
    return this.model('comment')
      .add(Object.assign(comment, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number?} userId 
   * @param {number?} valueId 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Comment[]}>}
   */
  querySelective(userId, valueId, page, limit, sort, order) {
    const model = this.model('comment');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, {
        userId,
      });
    }

    if (!think.isNullOrUndefined(valueId)) {
      Object.assign(where, {
        valueId,
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
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('comment')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Comment|Record<string, never>>}
   */
  findById(id) {
    return this.model('comment')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {Comment} comment 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(comment) {
    return this.model('comment')
      .where({
        id: comment.id,
      })
      .update(comment);
  }
}
