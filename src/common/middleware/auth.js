module.exports = (options, app) => {
    const config = app.think.config('auth');
    const service = app.think.service('auth');

    return (ctx, next) => {
        const token = ctx.header[config.header.toLowerCase()];
        if (token) {
            try {
                const data = service.verifyToken(token);
                ctx.state.userId = data?.userId;
            } catch (e) { }
        }

        return next();
    };
};