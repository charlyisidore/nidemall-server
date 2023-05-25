const axios = require('axios');

/**
 * @typedef {object} ExpressInfo
 * @property {string} EBusinessID - 用户ID
 * @property {string?} OrderCode - 订单编号
 * @property {string} ShipperCode - 快递公司编码
 * @property {string?} LogisticCode - 物流运单号
 * @property {boolean} Success - 成功与否
 * @property {string?} Reason - 失败原因
 * @property {string} State - 物流状态：2-在途中,3-签收,4-问题件
 * @property {{ AcceptTime: string, AcceptStation: string, Remark: string? }[]?} Traces - 时间, 描述, 备注
 * @property {string?} ShipperName - Custom property
 * http://www.kdniao.com/api-track
 */

module.exports = class ExpressService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} vendorCode 
   * @returns {string?}
   */
  getVendorName(vendorCode) {
    const config = this.config('express');

    if (think.isEmpty(config?.vendors) || !Array.isArray(config.vendors)) {
      return null;
    }

    for (const item of config.vendors) {
      if (item.code == vendorCode) {
        return item.name;
      }
    }

    return null;
  }

  /**
   * 
   * @param {string} shipperCode 
   * @param {string} logisticCode 
   * @param {string} orderCode 
   * @returns {Promise<ExpressInfo?>}
   */
  async getExpressInfo(shipperCode, logisticCode, orderCode = '') {
    const config = this.config('express');

    if (!config?.enable) {
      return null;
    }

    try {
      const result = await this.getOrderTracesByJson(shipperCode, logisticCode, orderCode);

      return Object.assign(result, {
        ShipperName: this.getVendorName(shipperCode),
      });
    } catch (error) {
      console.error(error);
      think.logger.error(error.toString());
    }

    return null;
  }

  /**
   * 
   * @param {string} shipperCode 
   * @param {string} logisticCode 
   * @param {string} orderCode 
   * @returns {Promise<ExpressInfo>}
   */
  getOrderTracesByJson(shipperCode, logisticCode, orderCode = '') {
    const config = this.config('express');

    const requestData = JSON.stringify({
      OrderCode: orderCode,
      ShipperCode: shipperCode,
      LogisticCode: logisticCode,
    });
    const dataSign = this.encrypt(requestData, config.appkey);

    // http://www.kdniao.com/api-track
    return axios({
      method: 'post',
      url: config.url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        RequestData: encodeURI(requestData),
        EBusinessID: config.appid,
        RequestType: '1002',
        DataSign: encodeURI(dataSign),
        DataType: '2',
      },
    });
  }

  /**
   * 
   * @param {string} content 
   * @param {string} keyValue 
   */
  encrypt(content, keyValue) {
    if (!think.isTrueEmpty(keyValue)) {
      content = `${content}${keyValue}`;
    }

    return Buffer.from(think.md5(content)).toString('base64')
  }
}