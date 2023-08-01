const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      user_id: {
        type: 'int(11)',
      },
      username: {
        type: 'varchar(63)',
        default: '',
      },
      mobile: {
        type: 'varchar(20)',
        default: '',
      },
      feed_type: {
        type: 'varchar(63)',
        default: '',
      },
      content: {
        type: 'varchar(1023)',
      },
      status: {
        type: 'int(3)',
      },
      has_picture: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      pic_urls: {
        type: 'varchar(1023)',
        dataType: 'json',
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
    };
  }
};
