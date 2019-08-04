/**
 * 文件及目录变动监听封装
 */
import * as fs from 'fs';
import * as chokidar from 'chokidar';

/**
 * 监听服务回调
 */
type watchCallback = (event: string, filePath: string, stats?: fs.Stats) => any;

const Watch = (
    /**
     * 监听的文件数组: file, dir, glob, or array
     */
    watchFiles: string | string[],
    /**
     * Watchpack配置参数
     */
    options?: chokidar.WatchOptions | watchCallback,
    /**
     * 文件change回调函数
     */
    cb?: watchCallback
): chokidar.FSWatcher => {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    const watcher = chokidar.watch(watchFiles, options);
    watcher.on('all', (event: string, filePath: string, stats?: fs.Stats) => {
        cb && cb(event, filePath, stats);
    });

    return watcher;
};

export default Watch;
