module.exports = class extends think.Service {
  config = {};

  constructor() {
    super();

    this.config = this.model('system')
      .select()
      .then((result) => {
        return result.reduce(
          (config, { keyName, keyValue }) => Object.assign(config, {
            [keyName]: keyValue,
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
    return this.getConfig('nidemall_wx_index_new');
  }

  /**
   * 
   */
  getHotLimit() {
    return this.getConfig('nidemall_wx_index_hot');
  }

  /**
   * 
   */
  getBrandLimit() {
    return this.getConfig('nidemall_wx_index_brand');
  }

  /**
   * 
   */
  getTopicLimit() {
    return this.getConfig('nidemall_wx_index_topic');
  }

  /**
   * 
   */
  getCatlogListLimit() {
    return this.getConfig('nidemall_wx_index_catlog_list');
  }

  /**
   * 
   */
  getCatlogMoreLimit() {
    return this.getConfig('nidemall_wx_index_catlog_more');
  }

  /**
   * 
   */
  getMallName() {
    return this.getConfig('nidemall_mall_name');
  }

  /**
   * 
   */
  getMallAddress() {
    return this.getConfig('nidemall_mall_address');
  }

  /**
   * 
   */
  getMallPhone() {
    return this.getConfig('nidemall_mall_phone');
  }

  /**
   * 
   */
  getMallQq() {
    return this.getConfig('nidemall_mall_qq');
  }

  /**
   * 
   */
  getMallLongitude() {
    return this.getConfig('nidemall_mall_longitude');
  }

  /**
   * 
   */
  getMallLatitude() {
    return this.getConfig('nidemall_mall_latitude');
  }

  /**
   * 
   */
  isAutoCreateShareImage() {
    return this.getConfig('nidemall_wx_share');
  }
}