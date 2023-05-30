module.exports = class FeedbackService extends think.Service {
  constructor() {
    super();
  }
  
  /**
   * 
   * @param {Feedback} feedback 
   * @returns {Promise<number>} The ID inserted
   */
  add(feedback) {
    const now = new Date();
    return this.model('feedback')
      .add(Object.assign(feedback, {
        addtime: now,
        updateTime: now,
      }));
  }
}