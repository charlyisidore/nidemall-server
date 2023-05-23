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
      goods_id: {
        type: 'int(11)',
      },
      goods_sn: {
        type: 'varchar(63)',
      },
      goods_name: {
        type: 'varchar(127)',
      },
      product_id: {
        type: 'int(11)',
      },
      price: {
        type: 'decimal(10,2)',
      },
      number: {
        type: 'smallint(5)',
      },
      specifications: {
        type: 'varchar(1023)',
        dataType: 'json',
      },
      checked: {
        type: 'tinyint(1)',
        dataType: 'boolean',
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
        dataType: 'boolean',
      },
    }
  }
};
