module.exports = () => {
    const config = think.config('auth');
    const service = think.service('auth');

    return (ctx, next) => {
        const token = ctx.header[config.header];
        if (token) {
            try {
                const data = service.verifyToken(token);
                ctx.state.userId = data?.userId;
            } catch (e) { }
        }

        return next();
    };
};