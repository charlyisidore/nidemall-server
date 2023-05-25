const Base = require('./base.js');

module.exports = class WxCommentController extends Base {
  async postAction() {
    const userId = this.getUserId();
    /** @type {{ content: string, star: number, type: number, valueId: number, hasPicture: boolean, picUrls: string[] }} */
    const comment = this.post([
      'content',
      'star',
      'type',
      'valueId',
      'hasPicture',
      'picUrls',
    ].join(','));

    /** @type {CommentService} */
    const commentService = this.service('comment');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (comment.star < 0 || comment.star > 5) {
      return this.badArgumentValue();
    }

    switch (comment.type) {
      case 0:
        if (think.isEmpty(await goodsService.findById(comment.valueId))) {
          return this.badArgumentValue();
        }
        break;
      case 1:
        if (think.isEmpty(await topicService.findById(comment.valueId))) {
          return this.badArgumentValue();
        }
        break;
      default:
        return this.badArgumentValue();
    }

    if (!comment.hasPicture) {
      Object.assign(comment, {
        picUrls: [],
      });
    }

    Object.assign(comment, {
      userId,
    });

    await commentService.save(comment);

    this.success(comment);
  }

  async countAction() {
    const type = this.get('type');
    const valueId = this.get('valueId');

    /** @type {CommentService} */
    const commentService = this.service('comment');

    const allCount = await commentService.count(type, valueId, 0);
    const hasPicCount = await commentService.count(type, valueId, 1);

    return this.success({
      hasPicCount,
      allCount,
    });
  }

  async listAction() {
    const type = this.get('type');
    const valueId = this.get('valueId');
    const showType = this.get('showType');
    const page = this.get('page');
    const limit = this.get('limit');

    /** @type {CommentService} */
    const commentService = this.service('comment');
    /** @type {UserService} */
    const userService = this.service('user');

    const commentList = await commentService.query(type, valueId, showType, page, limit);

    const commentVoList = await Promise.all(
      commentList.data.map(async (comment) => {
        const userInfo = await userService.getInfo(comment.userId);
        return {
          userInfo,
          addTime: comment.addTime,
          star: comment.star,
          picList: comment.picUrls,
          adminContent: comment.adminContent,
          content: comment.content,
        };
      })
    );

    return this.successList(commentVoList, commentList);
  }
};
