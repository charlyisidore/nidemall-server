const Base = require('./base.js');

module.exports = class QrCodeService extends Base {
  /**
   * .
   * @param {string} goodsName .
   * @param {string} goodsPicUrl .
   * @param {Groupon} groupon .
   * @returns {Promise<string>}
   */
  async createGrouponShareImage(goodsName, goodsPicUrl, groupon) {
    try {
      /** @type {StorageService} */
      const storageService = think.service('storage');
      /** @type {WeixinService} */
      const weixinService = think.service('weixin');

      const file = await weixinService.getUnlimitedQrCode(
        `groupon,${groupon.id}`,
        'pages/index/index'
      );

      const storage = await storageService.store(
        file,
        'image/jpeg',
        `GOOD_QCODE_${groupon.id}.jpg`
      );

      return storage.url;
    } catch (e) {
      console.error(e);
      think.logger.error(e.toString());
      return '';
    }
  }

  /**
   * .
   * @param {number} goodsId .
   * @param {string} goodsPicUrl .
   * @param {string} goodsName .
   * @returns {Promise<string>}
   */
  async createGoodsShareImage(goodsId, goodsPicUrl, goodsName) {
    try {
      /** @type {StorageService} */
      const storageService = think.service('storage');
      /** @type {WeixinService} */
      const weixinService = think.service('weixin');

      const file = await weixinService.getUnlimitedQrCode(
        `goods,${goodsId}`,
        'pages/index/index'
      );

      const storage = await storageService.store(
        file,
        'image/jpeg',
        `GOOD_QCODE_${goodsId}.jpg`
      );

      return storage.url;
    } catch (e) {
      console.error(e);
      think.logger.error(e.toString());
      return '';
    }
  }
};
