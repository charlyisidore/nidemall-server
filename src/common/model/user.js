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
      gender: {
        type: 'tinyint(3)',
      },
      birthday: {
        type: 'date',
      },
      last_login_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      last_login_ip: {
        type: 'varchar(63)',
      },
      user_level: {
        type: 'tinyint(3)',
      },
      nickname: {
        type: 'varchar(63)',
      },
      mobile: {
        type: 'varchar(20)',
      },
      avatar: {
        type: 'varchar(255)',
      },
      weixin_openid: {
        type: 'varchar(63)',
      },
      session_key: {
        type: 'varchar(100)',
      },
      status: {
        type: 'tinyint(3)',
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
    }
  }
};
