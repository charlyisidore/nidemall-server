const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      name: {
        type: 'varchar(255)',
      },
      desc: {
        type: 'varchar(255)',
      },
      pic_url: {
        type: 'varchar(255)',
      },
      sort_order: {
        type: 'tinyint(3)',
      },
      floor_price: {
        type: 'decimal(10,2)',
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
