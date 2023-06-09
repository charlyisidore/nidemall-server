module.exports = (options, app) => {
  const service = app.think.service('admin');

  return async (ctx, next) => {
    const id = await ctx.session('adminId');
    ctx.state.adminId = id;
    ctx.state.admin = think.isNullOrUndefined(id) ?
      {} :
      await service.findAdminById(id);
    return next();
  };
};
