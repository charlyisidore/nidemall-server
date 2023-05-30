const Base = require('./base.js');

module.exports = class WxFeedbackController extends Base {
  async submitAction() {
    const userId = this.getUserId();
    /** @type {string} */
    const content = this.get('content');
    /** @type {string} */
    const feedType = this.get('feedType');
    /** @type {boolean} */
    const hasPicture = this.get('hasPicture');
    /** @type {string[]} */
    let picUrls = this.get('picUrls');
    /** @type {string} */
    const mobile = this.get('mobile');

    /** @type {FeedbackService} */
    const feedbackService = this.service('feedback');
    /** @type {UserService} */
    const userService = this.service('user');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (!hasPicture) {
      picUrls = [];
    }

    const user = await userService.findById(userId);

    await feedbackService.add({
      userId,
      username: user.username,
      status: 1,
      content,
      feedType,
      hasPicture,
      picUrls,
      mobile,
    });

    return this.success();
  }
};
