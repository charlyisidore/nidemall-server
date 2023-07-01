const Base = require('./base.js');

module.exports = class NoticeAdminService extends Base {
  /**
   * .
   * @param {string?} title .
   * @param {string?} type .
   * @param {integer} adminId .
   * @param {number} page .
   * @param {number} limit .
   * @param {string} sort .
   * @param {string} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: NoticeAdmin[]}>}
   */
  async querySelective(title, type, adminId, page, limit, sort, order) {
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
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * .
   * @param {number} noticeId .
   * @param {number} adminId .
   * @returns {Promise<NoticeAdmin|Record<string, never>>}
   */
  async find(noticeId, adminId) {
    return this.model('notice_admin')
      .where({
        noticeId,
        adminId,
        deleted: false,
      })
      .find();
  }

  /**
   * .
   * @param {NoticeAdmin} noticeAdmin .
   * @returns {Promise<number>} The ID inserted
   */
  async add(noticeAdmin) {
    const now = new Date();
    return this.model('notice_admin')
      .add(Object.assign(noticeAdmin, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {NoticeAdmin} noticeAdmin .
   * @returns {Promise<number>} The number of rows affected
   */
  async update(noticeAdmin) {
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
   * .
   * @param {number[]} ids .
   * @param {number} adminId .
   * @returns {Promise<number>} The number of rows affected
   */
  async markReadByIds(ids, adminId) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        id: ['IN', ids],
        adminId,
        deleted: false,
      })
      .update({
        readTime: now,
        updateTime: now,
      });
  }

  /**
   * .
   * @param {number} id .
   * @param {number} adminId .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id, adminId) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        id,
        adminId,
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  /**
   * .
   * @param {number[]} ids .
   * @param {number} adminId .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByIds(ids, adminId) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        id: ['IN', ids],
        adminId,
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  /**
   * .
   * @param {number} adminId .
   * @returns {Promise<number>}
   */
  async countUnread(adminId) {
    return this.model('notice_admin')
      .where({
        adminId,
        readTime: null,
        deleted: false,
      })
      .count();
  }

  /**
   * .
   * @param {number} noticeId .
   * @returns {Promise<NoticeAdmin[]>}
   */
  async queryByNoticeId(noticeId) {
    return this.model('notice_admin')
      .where({
        noticeId,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {number} noticeId .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByNoticeId(noticeId) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        noticeId,
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  /**
   * .
   * @param {number[]} ids .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByNoticeIds(ids) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        noticeId: ['IN', ids],
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  /**
   * .
   * @param {number} noticeId .
   * @returns {Promise<number>}
   */
  async countReadByNoticeId(noticeId) {
    return this.model('notice_admin')
      .where({
        noticeId,
        readTime: ['!=', null],
        deleted: false,
      })
      .count();
  }

  /**
   * .
   * @param {NoticeAdmin} noticeAdmin .
   * @param {number} noticeId .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateByNoticeId(noticeAdmin, noticeId) {
    const now = new Date();
    return this.model('notice_admin')
      .where({
        noticeId,
        deleted: false,
      })
      .update(Object.assign(noticeAdmin, {
        updateTime: now,
      }));
  }
};
