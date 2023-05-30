module.exports = class extends think.Logic {
  uploadAction() {
    this.allowMethods = 'POST';

    this.rules = {
      file: {
        method: 'FILE',
        image: true,
        required: true,
      },
    };
  }
};
