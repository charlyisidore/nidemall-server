const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      goods_id: {
        type: 'int(11)',
      },
      specification: {
        type: 'varchar(255)',
      },
      value: {
        type: 'varchar(255)',
      },
      pic_url: {
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
    }
  }
};
