const Base = require('./base.js');

module.exports = class WxAddressController extends Base {
  async listAction() {
    const userId = this.getUserId();
    /** @type {AddressService} */
    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const addressList = await addressService.queryByUid(userId);

    return this.successList(addressList);
  }

  async detailAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const id = this.get('id');

    /** @type {AddressService} */
    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const address = await addressService.query(id, userId);

    if (think.isEmpty(address)) {
      return this.badArgumentValue();
    }

    return this.success(address);
  }

  async saveAction() {
    const userId = this.getUserId();
    /** @type {{ id: number?, name: string, tel: string, province: string, city: string, county: string, areaCode: string, addressDetail: string, isDefault: boolean }} */
    const address = this.post([
      'id',
      'name',
      'tel',
      'province',
      'city',
      'county',
      'areaCode',
      'addressDetail',
      'isDefault',
    ].join(','));

    /** @type {AddressService} */
    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (!address.id) {
      if (address.isDefault) {
        await addressService.resetDefault(userId);
      }

      Object.assign(address, {
        id: null,
        userId,
      });

      address.id = await addressService.add(address);
    } else {
      const addr = await addressService.query(address.id, userId);

      if (think.isEmpty(addr)) {
        return this.badArgumentValue();
      }

      if (address.isDefault) {
        await addressService.resetDefault(userId);
      }

      Object.assign(address, {
        userId,
      });

      await addressService.update(address);
    }

    return this.success(address.id);
  }

  async deleteAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const id = this.post('id');

    /** @type {AddressService} */
    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const address = await addressService.query(id, userId);
    if (think.isEmpty(address)) {
      return this.badArgumentValue();
    }

    await addressService.delete(id);
    return this.success();
  }
};
