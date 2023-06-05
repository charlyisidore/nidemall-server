module.exports = [
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