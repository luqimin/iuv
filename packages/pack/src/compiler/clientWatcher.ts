/**
 * 监听并编译文件
 */

import webpack from 'webpack';
import logger from '../utils/logger';

export const clientWatcher = (webpackConfig: webpack.Configuration, title: string): Promise<void> => {
    // webpack compiler
    const compiler: webpack.Compiler = webpack(webpackConfig);

    logger.success(`webpack开始监听「${title}」...`);

    // webpack watch模式会立即打包一次文件，这里设置一个promise，当且仅当第一次打包成功时resolve
    let compiledTimes: number = 0;

    return new Promise((resolve) => {
        compiler.watch({aggregateTimeout: 1000}, (err, stats) => {
            if (compiledTimes === 0) {
                resolve();
            }
            // 记录打包次数
            compiledTimes++;

            if (err) {
                logger.error(err.stack || err.message);
                if ((err as any).details) {
                    logger.error((err as any).details);
                }
                return;
            }

            if (!stats) {
                logger.error('webpack stats 不存在');
                return
            }

            const info = stats.toJson('minimal');

            if (stats.hasErrors()) {
                (info.errors || []).forEach(err=>logger.log(err.message))
                return;
            }
        });
    });
};
