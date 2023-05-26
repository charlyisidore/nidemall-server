module.exports = class WxBaseController extends think.Controller {
  /**
   * Get the logged in user ID
   * @returns {number?} User ID
   */
  getUserId() {
    return this.ctx.state.userId;
  }

  /**
   * Incorrect parameters
   */
  badArgument() {
    return this.fail(401, '参数不对');
  }

  /**
   * Incorrect parameter value
   */
  badArgumentValue() {
    return this.fail(402, '参数值不对');
  }

  /**
   * Please login
   */
  unlogin() {
    return this.fail(501, '请登录');
  }

  /**
   * System internal error
   */
  serious() {
    return this.fail(502, '系统内部错误');
  }

  /**
   * Business not supported
   */
  unsupport() {
    return this.fail(503, '业务不支持');
  }

  /**
   * Update data is no longer valid
   */
  updatedDateExpired() {
    return this.fail(504, '更新数据已经失效');
  }

  /**
   * Update data is no longer valid
   */
  updatedDataFailed() {
    return this.fail(505, '更新数据失败');
  }

  /**
   * No operation privileges
   */
  unauthz() {
    return this.fail(506, '无操作权限');
  }

  /**
   * Success response
   * @param {any} data `data` property
   * @param {string?} message `errmsg` property
   */
  success(data, message = '成功') {
    return super.success(data, message);
  }

  /**
   * Convert lists obtained with `Model.countSelect()` to success responses
   * @param {{ pageSize: number, currentPage: number, count: number, totalPages: number, data: any[] }|any[]} list 
   * @param {{ pageSize: number, currentPage: number, count: number, totalPages: number, data: any[] }|any[]|undefined} pagedList 
   * @returns {{ total: number, pages: number, limit: number, page: number, list: any[] }}
   */
  successList(list, pagedList) {
    const data = {};

    if (think.isNullOrUndefined(pagedList)) {
      pagedList = list;
    }

    if (Array.isArray(pagedList)) {
      Object.assign(data, {
        total: pagedList.length,
        pages: 1,
        limit: pagedList.length,
        page: 1,
      });
    } else {
      Object.assign(data, {
        total: pagedList.count,
        pages: pagedList.totalPages,
        limit: pagedList.pageSize,
        page: pagedList.totalPages > 0 ? pagedList.currentPage : 0,
      });
    }

    Object.assign(data, {
      list: Array.isArray(list) ? list : list.data,
    })

    return this.success(data);
  }
};
