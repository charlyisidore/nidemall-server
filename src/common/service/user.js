module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('user')
      .where({ id })
      .find();
  }
}