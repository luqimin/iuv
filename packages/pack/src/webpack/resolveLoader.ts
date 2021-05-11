/**
 * webpack resolveLoader 配置
 */

import * as path from 'path';

let babelLoaderPath: string = '';

try {
    babelLoaderPath = require.resolve('babel-loader');
    // eslint-disable-next-line no-empty
} catch (error) {}

const modules = ['node_modules'];

if (babelLoaderPath) {
    modules.unshift(path.resolve(__dirname, babelLoaderPath.replace(/(.+node_modules).+/, '$1')));
}

export default {
    common: {
        modules,
    },
    production: {},
    development: {},
};
