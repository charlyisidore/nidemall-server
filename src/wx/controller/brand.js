const Base = require('./base.js');

module.exports = class WxBrandController extends Base {
  async listAction() {
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {BrandService} */
    const brandService = this.service('brand');

    const brandList = await brandService.query(page, limit, sort, order);

    return this.successList(brandList);
  }

  async detailAction() {
    /** @type {number} */
    const id = this.get('id');
    /** @type {BrandService} */
    const brandService = this.service('brand');

    const entity = await brandService.findById(id);

    if (think.isEmpty(entity)) {
      return this.badArgumentValue();
    }

    return this.success(entity);
  }
};
