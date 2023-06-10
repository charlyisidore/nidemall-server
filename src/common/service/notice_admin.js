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
   * @param {number} noticeId 
   * @param {number} adminId 
   * @returns {Promise<NoticeAdmin|Record<string, never>>}
   */
  find(noticeId, adminId) {
    return this.model('notice_admin')
      .where({
        noticeId,
        adminId,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {NoticeAdmin} noticeAdmin 
   * @returns {Promise<number>} The number of rows affected
   */
  update(noticeAdmin) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        id: noticeAdmin.id,
      })
      .update(Object.assign(noticeAdmin, {
        updateTime: now,
      }));
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