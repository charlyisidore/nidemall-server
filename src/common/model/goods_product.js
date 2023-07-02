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
      specifications: {
        type: 'varchar(1023)',
        dataType: 'json',
      },
      price: {
        type: 'decimal(10,2)',
      },
      number: {
        type: 'int(11)',
      },
      url: {
        type: 'varchar(125)',
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
