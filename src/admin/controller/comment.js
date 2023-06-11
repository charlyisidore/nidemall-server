const Base = require('./base.js');

module.exports = class AdminCommentController extends Base {
  async listAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {number?} */
    const valueId = this.get('valueId');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {CommentService} */
    const commentService = this.service('comment');

    const collectList = await commentService.querySelective(userId, valueId, page, limit, sort, order);

    return this.successList(collectList);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {CommentService} */
    const commentService = this.service('comment');

    await commentService.deleteById(id);

    return this.success();
  }
};
