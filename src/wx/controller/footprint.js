const Base = require('./base.js');

module.exports = class WxFootprintController extends Base {
  async deleteAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const id = this.get('id');

    /** @type {FootprintService} */
    const footprintService = this.service('footprint');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const footprint = await footprintService.findById(id, userId);

    if (think.isEmpty(footprint) || footprint.userId != userId) {
      return this.badArgumentValue();
    }

    await footprintService.deleteById(id);

    return this.success();
  }

  async listAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');

    /** @type {FootprintService} */
    const footprintService = this.service('footprint');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const footprintList = await footprintService.queryByAddTime(userId, page, limit);

    const footprintVoList = await Promise.all(
      footprintList.data.map(async (footprint) => {
        const goods = await goodsService.findById(footprint.goodsId);

        return {
          id: footprint.id,
          goodsId: footprint.goodsId,
          addTime: footprint.addTime,
          name: goods.name,
          brief: goods.brief,
          picUrl: goods.picUrl,
          retailPrice: goods.retailPrice,
        };
      })
    );

    return this.successList(footprintVoList, footprintList);
  }
};
