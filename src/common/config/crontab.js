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