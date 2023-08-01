const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      name: {
        type: 'varchar(63)',
        default: '',
      },
      keywords: {
        type: 'varchar(1023)',
        default: '',
      },
      desc: {
        type: 'varchar(255)',
        default: '',
      },
      pid: {
        type: 'int(11)',
      },
      icon_url: {
        type: 'varchar(255)',
        default: '',
      },
      pic_url: {
        type: 'varchar(255)',
        default: '',
      },
      level: {
        type: 'varchar(255)',
        default: '',
      },
      sort_order: {
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
    };
  }
};
