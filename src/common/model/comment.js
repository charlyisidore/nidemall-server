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
        default: '',
      },
      admin_content: {
        type: 'varchar(511)',
        default: '',
      },
      user_id: {
        type: 'int(11)',
      },
      has_picture: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      pic_urls: {
        type: 'varchar(1023)',
        dataType: 'json',
      },
      star: {
        type: 'smallint(6)',
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
