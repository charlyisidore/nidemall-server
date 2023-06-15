module.exports = (options, app) => {
  return async (ctx, next) => {
    ctx.state.adminId = await ctx.session('adminId');
    return next();
  };
};
