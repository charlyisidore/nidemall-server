// default config
module.exports = {
  workers: 1,
  auth: {
    header: 'X-Nidemall-Token',
    algorithm: 'HS256',
    expiresIn: '2h',
    audience: 'mp',
    issuer: 'nidemall',
    subject: 'nidemall auth token',
  },
};
