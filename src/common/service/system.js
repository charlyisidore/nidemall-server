module.exports = class extends think.Service {
  config = {
    nidemall_wx_index_new: '6',
    nidemall_wx_index_hot: '6',
    nidemall_wx_index_brand: '4',
    nidemall_wx_index_topic: '4',
    nidemall_wx_catlog_list: '4',
    nidemall_wx_catlog_goods: '4',
    nidemall_wx_share: 'false',
    nidemall_mall_name: 'nidemall',
    nidemall_mall_address: '上海',
    nidemall_mall_latitude: '31.201900',
    nidemall_mall_longitude: '121.587839',
    nidemall_mall_phone: '021-xxxx-xxxx',
    nidemall_mall_qq: '705144434',
  };

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
    return this.getConfig('nidemall_wx_catlog_list');
  }

  /**
   * 
   */
  getCatlogMoreLimit() {
    return this.getConfig('nidemall_wx_catlog_goods');
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