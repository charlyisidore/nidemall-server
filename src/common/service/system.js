module.exports = class SystemService extends think.Service {
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

    const re = new RegExp(`^${this.prefix}`);

    this.config = this.model('system')
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

  /**
   * 
   * @param {string?} key 
   * @returns {Promise<object|string>}
   */
  async getConfig(key) {
    const config = await this.config;
    return think.isUndefined(key) ?
      config :
      config[key];
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
    switch (await this.getConfig(key).toLowerCase()) {
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

  /**
   * 
   */
  getNewLimit() {
    return this.getConfigInt('wx_index_new');
  }

  /**
   * 
   */
  getHotLimit() {
    return this.getConfigInt('wx_index_hot');
  }

  /**
   * 
   */
  getBrandLimit() {
    return this.getConfigInt('wx_index_brand');
  }

  /**
   * 
   */
  getTopicLimit() {
    return this.getConfigInt('wx_index_topic');
  }

  /**
   * 
   */
  getCatlogListLimit() {
    return this.getConfigInt('wx_catlog_list');
  }

  /**
   * 
   */
  getCatlogMoreLimit() {
    return this.getConfigInt('wx_catlog_goods');
  }

  /**
   * 
   */
  isAutoCreateShareImage() {
    return this.getConfigBoolean('wx_share');
  }

  /**
   * 
   */
  getFreight() {
    return this.getConfigFloat('express_freight_value');
  }

  /**
   * 
   */
  getFreightLimit() {
    return this.getConfigFloat('express_freight_min');
  }

  /**
   * 
   */
  getOrderUnpaid() {
    return this.getConfigInt('order_unpaid');
  }

  /**
   * 
   */
  getOrderUnconfirm() {
    return this.getConfigInt('order_unconfirm');
  }

  /**
   * 
   */
  getOrderComment() {
    return this.getConfigInt('order_comment');
  }

  /**
   * 
   */
  getMallName() {
    return this.getConfig('mall_name');
  }

  /**
   * 
   */
  getMallAddress() {
    return this.getConfig('mall_address');
  }

  /**
   * 
   */
  getMallPhone() {
    return this.getConfig('mall_phone');
  }

  /**
   * 
   */
  getMallQq() {
    return this.getConfig('mall_qq');
  }

  /**
   * 
   */
  getMallLongitude() {
    return this.getConfig('mall_longitude');
  }

  /**
   * 
   */
  getMallLatitude() {
    return this.getConfig('mall_latitude');
  }
}