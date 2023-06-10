const Base = require('./base.js');

module.exports = class AdminAddressController extends Base {
  async listAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {string?} */
    const name = this.get('name');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {AddressService} */
    const addressService = this.service('address');

    const addressList = await addressService.querySelective(userId, name, page, limit, sort, order);

    return this.successList(addressList);
  }
};
