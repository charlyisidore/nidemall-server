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
        default: '',
      },
      value: {
        type: 'varchar(255)',
        default: '',
      },
      pic_url: {
        type: 'varchar(255)',
        default: '',
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
