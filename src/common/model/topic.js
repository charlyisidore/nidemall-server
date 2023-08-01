const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      title: {
        type: 'varchar(255)',
        default: '\'\'',
      },
      subtitle: {
        type: 'varchar(255)',
        default: '\'\'',
      },
      content: {
        type: 'text',
      },
      price: {
        type: 'decimal(10,2)',
      },
      read_count: {
        type: 'varchar(255)',
        default: '1k',
      },
      pic_url: {
        type: 'varchar(255)',
        default: '',
      },
      sort_order: {
        type: 'int(11)',
      },
      goods: {
        type: 'varchar(1023)',
        dataType: 'json',
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
