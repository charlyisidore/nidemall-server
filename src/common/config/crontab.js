module.exports = [
  // Clean captcha cache
  {
    interval: '1h',
    immediate: true,
    handle: async () => {
      /** @type {AuthService} */
      const authService = think.service('auth');
      await authService.cleanCaptchaCache();
    }
  },
]