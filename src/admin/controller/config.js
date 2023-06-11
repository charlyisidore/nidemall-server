const Base = require('./base.js');

module.exports = class AdminConfigController extends Base {
  mallAction() {
    switch (true) {
      case this.isGet:
        return this.getMall();
      case this.isPost:
        return this.postMall();
    }
  }

  expressAction() {
    switch (true) {
      case this.isGet:
        return this.getExpress();
      case this.isPost:
        return this.postExpress();
    }
  }

  orderAction() {
    switch (true) {
      case this.isGet:
        return this.getOrder();
      case this.isPost:
        return this.postOrder();
    }
  }

  wxAction() {
    switch (true) {
      case this.isGet:
        return this.getWx();
      case this.isPost:
        return this.postWx();
    }
  }

  async getMall() {
    /** @type {SystemService} */
    const systemService = this.service('system');

    const data = await systemService.listMall();

    return this.success(data);
  }

  async postMall() {
    /** @type {Record<string, string>} */
    const data = this.post();
    /** @type {SystemService} */
    const systemService = this.service('system');

    await systemService.updateConfig(data);
    await systemService.updateConfigs(data);

    return this.success();
  }

  async getExpress() {
    /** @type {SystemService} */
    const systemService = this.service('system');

    const data = await systemService.listExpress();

    return this.success(data);
  }

  async postExpress() {
    /** @type {Record<string, string>} */
    const data = this.post();
    /** @type {SystemService} */
    const systemService = this.service('system');

    await systemService.updateConfig(data);
    await systemService.updateConfigs(data);

    return this.success();
  }

  async getOrder() {
    /** @type {SystemService} */
    const systemService = this.service('system');

    const data = await systemService.listOrder();

    return this.success(data);
  }

  async postOrder() {
    /** @type {Record<string, string>} */
    const data = this.post();
    /** @type {SystemService} */
    const systemService = this.service('system');

    await systemService.updateConfig(data);

    return this.success();
  }

  async getWx() {
    /** @type {SystemService} */
    const systemService = this.service('system');

    const data = await systemService.listWx();

    return this.success(data);
  }

  async postWx() {
    /** @type {Record<string, string>} */
    const data = this.post();
    /** @type {SystemService} */
    const systemService = this.service('system');

    await systemService.updateConfig(data);
    await systemService.updateConfigs(data);

    return this.success();
  }
};
