const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      value_id: {
        type: 'int(11)',
      },
      type: {
        type: 'tinyint(3)',
      },
      content: {
        type: 'varchar(1023)',
      },
      admin_content: {
        type: 'varchar(511)',
      },
      user_id: {
        type: 'int(11)',
      },
      has_picture: {
        type: 'tinyint(1)',
      },
      pic_urls: {
        type: 'varchar(1023)',
      },
      star: {
        type: 'smallint(6)',
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
