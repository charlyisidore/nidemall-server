module.exports = class NoticeService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Notice|Record<string, never>>}
   */
  findById(id) {
    return this.model('notice')
      .where({ id })
      .find();
  }
}