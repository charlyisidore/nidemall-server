const Base = require('./base.js');

module.exports = class SystemService extends Base {
  prefix = '';

  config = {
    wx_index_new: '6',
    wx_index_hot: '6',
    wx_index_brand: '4',
    wx_index_topic: '4',
    wx_catlog_list: '4',
    wx_catlog_goods: '4',
    wx_share: 'false',
    express_freight_value: '8',
    express_freight_min: '88',
    order_unpaid: '30',
    order_unconfirm: '7',
    order_comment: '7',
    mall_name: 'nidemall',
    mall_address: '上海',
    mall_latitude: '31.201900',
    mall_longitude: '121.587839',
    mall_phone: '021-xxxx-xxxx',
    mall_qq: '705144434',
  };

  constructor() {
    super();

    this.prefix = think.config('system')?.prefix || '';
    this.config = null;
  }

  /**
   * 
   * @returns {Promise<Record<string, string>>}
   */
  async listMall() {
    return this._list('mall_');
  }

  /**
   * 
   * @returns {Promise<Record<string, string>>}
   */
  async listWx() {
    return this._list('wx_');
  }

  /**
   * 
   * @returns {Promise<Record<string, string>>}
   */
  async listOrder() {
    return this._list('order_');
  }

  /**
   * 
   * @returns {Promise<Record<string, string>>}
   */
  async listExpress() {
    return this._list('express_');
  }

  /**
   * 
   * @param {Record<string, string>} data 
   * @returns {Promise<number[]>}
   */
  async updateConfig(data) {
    const now = new Date();
    return Promise.all(
      Object.entries(data)
        .map(([keyName, keyValue]) => {
          return this.model('system')
            .where({
              keyName,
              deleted: false,
            })
            .update({
              keyValue,
              updateTime: now,
            })
        })
    );
  }

  async _list(prefix) {
    const systemList = await this.model('system')
      .where({
        keyName: ['LIKE', `${this.prefix}${prefix}%`],
        deleted: false,
      })
      .select();

    return Object.fromEntries(
      systemList.map(
        (system) => [system.keyName, system.keyValue]
      )
    );
  }

  /**
   * 
   * @param {string?} key 
   * @returns {Promise<object|string>}
   */
  async getConfig(key) {
    if (think.isNullOrUndefined(this.config)) {
      const re = new RegExp(`^${this.prefix}`);
      this.config = await this.model('system')
        .select()
        .then((result) => {
          return result.reduce(
            (config, { keyName, keyValue }) => Object.assign(config, {
              [keyName.replace(re, '')]: keyValue,
            }),
            {}
          );
        });
    }
    return think.isUndefined(key) ?
      this.config :
      this.config[key];
  }

  /**
   * 
   * @param {string?} key 
   * @returns {Promise<number>}
   */
  async getConfigInt(key) {
    return parseInt(await this.getConfig(key));
  }

  /**
   * 
   * @param {string?} key 
   * @returns {Promise<boolean?>}
   */
  async getConfigBoolean(key) {
    switch ((await this.getConfig(key)).toLowerCase()) {
      case 'true':
      case '1':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        return null;
    }
  }

  /**
   * 
   * @param {string?} key 
   * @returns {Promise<number>}
   */
  async getConfigFloat(key) {
    return parseFloat(await this.getConfig(key));
  }

  async setConfigs(configs) {
    await this.config;
    this.config = configs;
  }

  async updateConfigs(data) {
    await this.config;
    Object.entries(data)
      .forEach(([key, value]) => this.config[key] = value);
  }

  /**
   * 
   */
  async getNewLimit() {
    return this.getConfigInt('wx_index_new');
  }

  /**
   * 
   */
  async getHotLimit() {
    return this.getConfigInt('wx_index_hot');
  }

  /**
   * 
   */
  async getBrandLimit() {
    return this.getConfigInt('wx_index_brand');
  }

  /**
   * 
   */
  async getTopicLimit() {
    return this.getConfigInt('wx_index_topic');
  }

  /**
   * 
   */
  async getCatlogListLimit() {
    return this.getConfigInt('wx_catlog_list');
  }

  /**
   * 
   */
  async getCatlogMoreLimit() {
    return this.getConfigInt('wx_catlog_goods');
  }

  /**
   * 
   */
  async isAutoCreateShareImage() {
    return this.getConfigBoolean('wx_share');
  }

  /**
   * 
   */
  async getFreight() {
    return this.getConfigFloat('express_freight_value');
  }

  /**
   * 
   */
  async getFreightLimit() {
    return this.getConfigFloat('express_freight_min');
  }

  /**
   * 
   */
  async getOrderUnpaid() {
    return this.getConfigInt('order_unpaid');
  }

  /**
   * 
   */
  async getOrderUnconfirm() {
    return this.getConfigInt('order_unconfirm');
  }

  /**
   * 
   */
  async getOrderComment() {
    return this.getConfigInt('order_comment');
  }

  /**
   * 
   */
  async getMallName() {
    return this.getConfig('mall_name');
  }

  /**
   * 
   */
  async getMallAddress() {
    return this.getConfig('mall_address');
  }

  /**
   * 
   */
  async getMallPhone() {
    return this.getConfig('mall_phone');
  }

  /**
   * 
   */
  async getMallQq() {
    return this.getConfig('mall_qq');
  }

  /**
   * 
   */
  async getMallLongitude() {
    return this.getConfig('mall_longitude');
  }

  /**
   * 
   */
  async getMallLatitude() {
    return this.getConfig('mall_latitude');
  }
}
