const Base = require('./base.js');

module.exports = class AdminAdController extends Base {
  async listAction() {
    /** @type {string?} */
    const name = this.get('name');
    /** @type {string?} */
    const content = this.get('content');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {AdService} */
    const adService = this.service('ad');

    const adList = await adService.querySelective(name, content, page, limit, sort, order);

    return this.successList(adList);
  }

  async createAction() {
    const ad = this.post([
      'name',
      'content',
      'url',
      'position',
      'link',
      'enabled',
    ].join(','));

    /** @type {AdService} */
    const adService = this.service('ad');

    ad.id = await adService.add(ad);

    return this.success(ad);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {AdService} */
    const adService = this.service('ad');

    const ad = await adService.findById(id);

    return this.success(ad);
  }

  async updateAction() {
    const ad = this.post([
      'id',
      'name',
      'content',
      'url',
      'position',
      'link',
      'enabled',
    ].join(','));

    /** @type {AdService} */
    const adService = this.service('ad');

    if (!await adService.updateById(ad)) {
      return this.updatedDataFailed();
    }

    return this.success(ad);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AdService} */
    const adService = this.service('ad');

    await adService.deleteById(id);

    return this.success();
  }
};
