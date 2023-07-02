const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      goods_sn: {
        type: 'varchar(63)',
      },
      name: {
        type: 'varchar(127)',
      },
      category_id: {
        type: 'int(11)',
      },
      brand_id: {
        type: 'int(11)',
      },
      gallery: {
        type: 'varchar(1023)',
        dataType: 'json',
      },
      keywords: {
        type: 'varchar(255)',
      },
      brief: {
        type: 'varchar(255)',
      },
      is_on_sale: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      sort_order: {
        type: 'smallint(4)',
      },
      pic_url: {
        type: 'varchar(255)',
      },
      share_url: {
        type: 'varchar(255)',
      },
      is_new: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      is_hot: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      unit: {
        type: 'varchar(31)',
      },
      counter_price: {
        type: 'decimal(10,2)',
      },
      retail_price: {
        type: 'decimal(10,2)',
      },
      detail: {
        type: 'text',
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
