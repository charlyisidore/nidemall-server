const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      pid: {
        type: 'int(11)',
      },
      name: {
        type: 'varchar(120)',
      },
      type: {
        type: 'tinyint(3)',
      },
      code: {
        type: 'int(11)',
      },
    }
  }
};
