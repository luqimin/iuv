/**
 * 客户端静态文件(image等)打包监听服务
 */
import * as Path from 'path';

import * as fs from 'fs-extra';

import { IUVPackOptions } from '../const/config';
import { STATIC_FILES_IGNORE } from '../const/filename';
import logger from '../utils/logger';
import watch from '../utils/watch';

export const clientStaticWatcher = (options: IUVPackOptions): void => {
    const dir = Path.resolve(options.clientSourcePath!, 'assets');
    const dest = Path.resolve(options.clientPath!, 'assets');

    // 拷贝文件
    const copyFile = (path: string): void => {
        const relPath: string = Path.relative(dir, path);
        const newPath: string = Path.resolve(dest, relPath);
        fs.copy(path, newPath);
    };

    // 删除文件
    const deleteFile = (path: string): void => {
        const relPath: string = Path.relative(dir, path);
        const destPath: string = Path.resolve(dest, relPath);
        fs.remove(destPath);
    };

    // 监听非js文件
    logger.success('开始监听「客户端assets文件夹」...');
    watch(
        dir,
        {
            ignored: STATIC_FILES_IGNORE,
            persistent: true,
            ignoreInitial: false,
            ignorePermissionErrors: true,
        },
        (event, path) => {
            switch (event) {
                case 'change':
                case 'add':
                    copyFile(path);
                    break;
                case 'unlink':
                case 'unlinkDir':
                    deleteFile(path);
                    break;
                case 'addDir':
                    break;
                default:
                    break;
            }
        },
    );
};
