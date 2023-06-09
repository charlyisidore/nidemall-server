module.exports = class NoticeAdminService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string?} title 
   * @param {string?} type 
   * @param {integer} adminId 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: NoticeAdmin[]}>}
   */
  querySelective(title, type, adminId, page, limit, sort, order) {
    const model = this.model('notice_admin');

    const where = {
      adminId,
      deleted: false,
    };

    if (!think.isTrueEmpty(title)) {
      Object.assign(where, {
        title: ['LIKE', `%${title}%`],
      });
    }

    switch (type) {
      case 'read':
        Object.assign(where, {
          readTime: null,
        });
        break;
      case 'unread':
        Object.assign(where, {
          readTime: ['!=', null],
        });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    }

    return model
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} adminId 
   * @returns {Promise<number>}
   */
  countUnread(adminId) {
    return this.model('notice_admin')
      .where({
        adminId,
        readTime: null,
        deleted: false,
      })
      .count();
  }
}