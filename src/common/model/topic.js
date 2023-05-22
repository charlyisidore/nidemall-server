const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      title: {
        type: 'varchar(255)',
      },
      subtitle: {
        type: 'varchar(255)',
      },
      content: {
        type: 'text',
      },
      price: {
        type: 'decimal(10,2)',
      },
      read_count: {
        type: 'varchar(255)',
      },
      pic_url: {
        type: 'varchar(255)',
      },
      sort_order: {
        type: 'int(11)',
      },
      goods: {
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
        dataType: 'boolean',
      },
    }
  }
};
