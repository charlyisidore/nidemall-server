const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      username: {
        type: 'varchar(63)',
        default: '',
      },
      password: {
        type: 'varchar(63)',
        default: '',
      },
      last_login_ip: {
        type: 'varchar(63)',
        default: '',
      },
      last_login_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      avatar: {
        type: 'varchar(255)',
        default: '\'\'',
      },
      add_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      update_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      deleted: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      role_ids: {
        type: 'varchar(127)',
        dataType: 'json',
        default: '[]',
      },
    };
  }
};
