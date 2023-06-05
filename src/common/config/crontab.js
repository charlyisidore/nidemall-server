module.exports = [
  // Database backup job
  {
    cron: '0 0 5 * * ?',
    handle: () => {
      think.logger.info('系统开启定时任务数据库备份');
      think.logger.warn('TODO: backup db crontab');
      think.logger.info('系统结束定时任务数据库备份');
    },
  },
  // Coupon job
  {
    interval: '1h',
    immediate: true,
    handle: async () => {
      /** @type {CouponService} */
      const CouponService = think.service('coupon');
      await CouponService.checkCouponExpired();
    },
  },
  // Order job
  {
    cron: '0 0 3 * * ?',
    handle: async () => {
      /** @type {OrderService} */
      const orderService = think.service('order');
      await orderService.checkOrderUnconfirm();
    },
  },
  // Order job
  {
    cron: '0 0 4 * * ?',
    handle: async () => {
      /** @type {OrderService} */
      const orderService = think.service('order');
      await orderService.checkOrderComment();
    },
  },
  // Clean captcha cache
  {
    interval: '1h',
    immediate: true,
    handle: async () => {
      /** @type {AuthService} */
      const authService = think.service('auth');
      await authService.cleanCaptchaCache();
    },
  },
]