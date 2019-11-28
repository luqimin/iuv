/**
 * css打包监听服务
 */
import * as Path from 'path';
import { lstatSync } from 'fs-extra';
import { cssCompiler } from './cssCompiler';
import { IMEPackOptions, IMEPackConfig } from '../const/config';
import logger from '../utils/logger';
import watch from '../utils/watch';
import { STATIC_FILES_IGNORE } from '../const/filename';

export const cssWatcher = (options: IMEPackOptions, config: IMEPackConfig): void => {
    const dir = Path.resolve(options.clientSourcePath!, 'style');
    // 监听非js文件
    logger.success('开始监听「客户端style文件夹」...');
    watch(
        dir,
        {
            ignored: STATIC_FILES_IGNORE,
            persistent: true,
            ignoreInitial: false,
            ignorePermissionErrors: true,
        },
        (event, path, stats) => {
            switch (event) {
                case 'change':
                case 'add':
                    cssCompiler(options, config).all();
                    break;
                case 'unlink':
                case 'unlinkDir':
                    break;
                case 'addDir':
                    break;
                default:
                    break;
            }
        }
    );
};
