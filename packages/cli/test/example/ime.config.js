const path = require('path');

module.exports = {
    plugins: [],
    commands: {
        test: {
            // package: 'moment',
            path: path.resolve(__dirname, 'testCmd.js'),
            args: [
                { name: 'env', alias: 'e', type: String },
                { name: 'dd', type: Number },
            ],
        },
    },
};
