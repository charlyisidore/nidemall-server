module.exports = class extends think.Service {
  static PREFIX = 'nidemall_';

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

    const re = new RegExp(`^${this.constructor.PREFIX}`);

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
   */
  async getConfig(key) {
    const config = await this.config;
    return (undefined !== key) ?
      config[key] :
      config;
  }

  /**
   * 
   */
  getNewLimit() {
    return this.getConfig('wx_index_new');
  }

  /**
   * 
   */
  getHotLimit() {
    return this.getConfig('wx_index_hot');
  }

  /**
   * 
   */
  getBrandLimit() {
    return this.getConfig('wx_index_brand');
  }

  /**
   * 
   */
  getTopicLimit() {
    return this.getConfig('wx_index_topic');
  }

  /**
   * 
   */
  getCatlogListLimit() {
    return this.getConfig('wx_catlog_list');
  }

  /**
   * 
   */
  getCatlogMoreLimit() {
    return this.getConfig('wx_catlog_goods');
  }

  /**
   * 
   */
  isAutoCreateShareImage() {
    return this.getConfig('wx_share');
  }

  /**
   * 
   */
  getFreight() {
    return this.getConfig('express_freight_value');
  }

  /**
   * 
   */
  getFreightLimit() {
    return this.getConfig('express_freight_min');
  }

  /**
   * 
   */
  getOrderUnpaid() {
    return this.getConfig('order_unpaid');
  }

  /**
   * 
   */
  getOrderUnconfirm() {
    return this.getConfig('order_unconfirm');
  }

  /**
   * 
   */
  getOrderComment() {
    return this.getConfig('order_comment');
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