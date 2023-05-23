module.exports = class extends think.Controller {
  __before() {

  }

  getBoolean(name, defaultValue = null) {
    return this._parseBoolean(this.get(name), defaultValue);
  }

  getInt(name, defaultValue = null) {
    return this._parseInt(this.get(name), defaultValue);
  }

  getString(name, defaultValue = null) {
    return this._parseString(this.get(name), defaultValue);
  }

  postBoolean(name, defaultValue = null) {
    return this._parseBoolean(this.post(name), defaultValue);
  }

  postInt(name, defaultValue = null) {
    return this._parseInt(this.post(name), defaultValue);
  }

  postString(name, defaultValue = null) {
    return this._parseString(this.post(name), defaultValue);
  }

  postJson(name, defaultValue = null) {
    try {
      return JSON.parse(this.post(name));
    } catch (e) {
      return defaultValue;
    }
  }

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

  _parseBoolean(value, defaultValue) {
    if (undefined === value) {
      return defaultValue;
    } else if ('true' === value) {
      return true;
    } else if ('false' === value) {
      return false;
    } else {
      return !!parseInt(value);
    }
  }

  _parseInt(value, defaultValue) {
    return (undefined === value) ? defaultValue : parseInt(value);
  }

  _parseString(value, defaultValue) {
    return (undefined === value) ? defaultValue : value;
  }
};
