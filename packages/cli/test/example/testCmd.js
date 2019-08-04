const { BaseClass } = require('@iuv/core');

class TestCmd extends BaseClass {
    running() {
        console.log('this.params:\n', this.params);
        console.log('this.runtime:\n', this.runtime);
    }
}

module.exports = TestCmd;
