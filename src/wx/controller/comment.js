const Base = require('./base.js');

module.exports = class extends Base {
  async postAction() {
    const userId = this.getUserId();

    const valueId = parseInt(this.post('valueId'));
    const type = parseInt(this.post('type'));
    const content = this.post('content');
    const hasPicture = parseInt(this.post('hasPicture'));
    const star = parseInt(this.post('star'));
    let picUrls = JSON.parse(this.post('picUrls') || '[]');

    const commentService = this.service('comment');
    const goodsService = this.service('goods');
    const topicService = this.service('topic');

    if (!userId) {
      return this.unlogin();
    }

    if (!content || !star) {
      return this.badArgument();
    }

    if (star < 0 || star > 5) {
      return this.badArgumentValue();
    }

    if (undefined === type || null === type || !valueId) {
      return this.badArgument();
    }

    if (0 == type) {
      if (!await goodsService.findById(valueId)) {
        return this.badArgumentValue();
      }
    } else if (1 == type) {
      if (!await topicService.findById(valueId)) {
        return this.badArgumentValue();
      }
    } else {
      return this.badArgumentValue();
    }

    if (!hasPicture) {
      picUrls = [];
    }

    const comment = {
      valueId,
      type,
      content,
      userId,
      hasPicture,
      picUrls,
      star,
      deleted: false,
    };

    await commentService.save(comment);

    this.success(comment);
  }

  async countAction() {
    const type = parseInt(this.get('type'));
    const valueId = parseInt(this.get('valueId'));

    const commentService = this.service('comment');

    const allCount = await commentService.count(type, valueId, 0);
    const hasPicCount = await commentService.count(type, valueId, 1);

    return this.success({
      hasPicCount,
      allCount,
    });
  }

  async listAction() {
    const type = parseInt(this.get('type'));
    const valueId = parseInt(this.get('valueId'));
    const showType = parseInt(this.get('showType'));
    const page = parseInt(this.get('page') || '1');
    const limit = parseInt(this.get('limit') || '10');

    const commentService = this.service('comment');
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

    return this.success({
      total: commentList.count,
      pages: commentList.totalPages,
      limit: commentList.pageSize,
      page: commentList.currentPage,
      list: commentVoList,
    });
  }
};
