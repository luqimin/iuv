/**
 * 读取文件内容 返回json或字符串
 */

import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { prefix } from './log';

export const readFile = (filepath: string): string | object | any => {
    try {
        // if not js module, just return content buffer
        const extname = path.extname(filepath);
        if (!['.js', '.node', '.json', ''].includes(extname)) {
            return fs.readFileSync(filepath, 'utf8');
        }
        // require js module
        const obj = require(filepath);
        if (!obj) {
            return obj;
        }
        // it's es module
        if (obj.__esModule) {
            return 'default' in obj ? obj.default : obj;
        }
        return obj;
    } catch (err) {
        err.message = prefix() + chalk.red(`读取文件「${filepath}」错误: ${err.message}`);
        throw err;
    }
};
