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