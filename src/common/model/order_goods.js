const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      order_id: {
        type: 'int(11)',
      },
      goods_id: {
        type: 'int(11)',
      },
      goods_name: {
        type: 'varchar(127)',
        default: '',
      },
      goods_sn: {
        type: 'varchar(63)',
        default: '',
      },
      product_id: {
        type: 'int(11)',
      },
      number: {
        type: 'smallint(5)',
      },
      price: {
        type: 'decimal(10,2)',
      },
      specifications: {
        type: 'varchar(1023)',
        dataType: 'json',
      },
      pic_url: {
        type: 'varchar(255)',
        default: '',
      },
      comment: {
        type: 'int(11)',
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
