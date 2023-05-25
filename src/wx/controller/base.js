module.exports = class WxBaseController extends think.Controller {
  /**
   * 
   * @returns {number?} User ID
   */
  getUserId() {
    return this.ctx.state.userId;
  }

  badArgument() {
    return this.fail(401, '参数不对');
  }

  badArgumentValue() {
    return this.fail(402, '参数值不对');
  }

  unlogin() {
    return this.fail(501, '请登录');
  }

  serious() {
    return this.fail(502, '系统内部错误');
  }

  unsupport() {
    return this.fail(503, '业务不支持');
  }

  updatedDateExpired() {
    return this.fail(504, '更新数据已经失效');
  }

  updatedDataFailed() {
    return this.fail(505, '更新数据失败');
  }

  unauthz() {
    return this.fail(506, '无操作权限');
  }

  success(data, message = '成功') {
    return super.success(data, message);
  }
};
