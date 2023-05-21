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
      },
      mobile: {
        type: 'varchar(20)',
      },
      feed_type: {
        type: 'varchar(63)',
      },
      content: {
        type: 'varchar(1023)',
      },
      status: {
        type: 'int(3)',
      },
      has_picture: {
        type: 'tinyint(1)',
      },
      pic_urls: {
        type: 'varchar(1023)',
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
    }
  }
};
