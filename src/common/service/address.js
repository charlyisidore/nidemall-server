module.exports = class AddressService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   */
  queryByUid(userId) {
    return this.model('address')
      .where({
        userId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} id 
   */
  query(userId, id) {
    return this.model('address')
      .where({
        id,
        userId,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {object} address 
   */
  add(address) {
    const now = new Date();
    return this.model('address')
      .add(Object.assign(address, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {object} address 
   */
  update(address) {
    const now = new Date();
    return this.model('address')
      .where({ id: address.id })
      .update(Object.assign(address, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   */
  delete(id) {
    return this.model('address')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} userId 
   */
  findDefault(userId) {
    return this.model('address')
      .where({
        userId,
        isDefault: true,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} userId 
   */
  resetDefault(userId) {
    const now = new Date();
    return this.model('address')
      .where({
        userId,
        deleted: false,
      })
      .update({
        isDefault: false,
        updateTime: now,
      });
  }
}