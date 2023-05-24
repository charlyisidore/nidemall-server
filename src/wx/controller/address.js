const Base = require('./base.js');

module.exports = class WxAddressController extends Base {
  async listAction() {
    const userId = this.getUserId();
    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const addressList = await addressService.queryByUid(userId);

    return this.success({
      total: addressList.length,
      pages: 1,
      limit: 0,
      page: 1,
      list: addressList,
    });
  }

  async detailAction() {
    const userId = this.getUserId();
    const id = this.postInt('id');

    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const address = await addressService.query(userId, id);

    if (think.isEmpty(address)) {
      return this.badArgumentValue();
    }

    return this.success(address);
  }

  async saveAction() {
    const userId = this.getUserId();
    const address = this.postAddress();

    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (!this.validate(address)) {
      return this.badArgument();
    }

    if (!address.id) {
      if (address.isDefault) {
        await addressService.resetDefault(userId);
      }

      Object.assign(address, {
        id: null,
        userId,
      });

      await addressService.add(address);
    } else {
      const addr = await addressService.query(userId, address.id);

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
    const id = this.postInt('id');

    const addressService = this.service('address');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (think.isNullOrUndefined(id)) {
      return this.badArgument();
    }

    const address = await addressService.query(userId, id);
    if (think.isEmpty(address)) {
      return this.badArgumentValue();
    }

    await addressService.delete(id);
    return this.success();
  }

  postAddress() {
    return {
      id: this.postInt('id'),
      name: this.postString('name'),
      userId: this.postInt('userId'),
      province: this.postString('province'),
      city: this.postString('city'),
      county: this.postString('county'),
      addressDetail: this.postString('addressDetail'),
      areaCode: this.postString('areaCode'),
      postalCode: this.postString('postalCode'),
      tel: this.postString('tel'),
      isDefault: this.postBoolean('isDefault'),
    };
  }

  validate(address) {
    return !think.isTrueEmpty(address.name) &&
      !think.isTrueEmpty(address.mobile) &&
      this.isMobileSimple(address.mobile) &&
      !think.isTrueEmpty(address.province) &&
      !think.isTrueEmpty(address.city) &&
      !think.isTrueEmpty(address.county) &&
      !think.isTrueEmpty(address.areaCode) &&
      !think.isTrueEmpty(address.addressDetail) &&
      !think.isNullOrUndefined(address.isDefault);
  }

  isMobileSimple(input) {
    return /^[1]\d{10}$/.test(input);
  }
};
