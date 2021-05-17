import * as path from 'path';

import * as fs from 'fs-extra';

import { IUVPackOptions } from '../const/config';

export default (options: IUVPackOptions) => {
    // 只能计算alias
    const alias: { [key: string]: string } = {};

    // 获取src下面所有目录
    const clientSrc: string = options.clientSourcePath!;
    const paths: string[] = fs.readdirSync(clientSrc);
    const dirs = paths.filter((dir) => {
        const wholePath = path.resolve(clientSrc, dir);
        if (dir.startsWith('.')) {
            return false;
        }
        return fs.statSync(wholePath).isDirectory();
    });

    for (const name of dirs) {
        alias[`@${name}`] = path.resolve(clientSrc, name);
    }

    alias['@'] = path.resolve(clientSrc);

    return {
        common: {
            alias,
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css'],
        },
        production: {},
        development: {},
    };
};
