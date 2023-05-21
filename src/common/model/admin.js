const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      username: {
        type: 'varchar(63)',
      },
      password: {
        type: 'varchar(63)',
      },
      last_login_ip: {
        type: 'varchar(63)',
      },
      last_login_time: {
        type: 'datetime',
      },
      avatar: {
        type: 'varchar(255)',
      },
      add_time: {
        type: 'datetime',
      },
      update_time: {
        type: 'datetime',
      },
      deleted: {
        type: 'tinyint(1)',
      },
      role_ids: {
        type: 'varchar(127)',
      },
    }
  }
};
