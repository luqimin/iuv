/**
 * 监听并编译文件
 */

import * as webpack from 'webpack';
import logger from '../utils/logger';

export const clientWatcher = (webpackConfig: webpack.Configuration, title: string): Promise<void> => {
    // webpack compiler
    const compiler: webpack.Compiler = webpack(webpackConfig);

    logger.success(`webpack开始监听「${title}」...`);

    // webpack watch模式会立即打包一次文件，这里设置一个promise，当且仅当第一次打包成功时resolve
    let compiledTimes: number = 0;

    return new Promise((resolve) => {
        compiler.watch({}, (err, stats) => {
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

            const info = stats.toJson('minimal');

            if (stats.hasErrors()) {
                logger.error(info.errors.join('\n'));
                return;
            }

            let logMsg: string = `webpack打包「${title}」成功, 共打包${info.filteredModules}个模块`;
            if (stats.hasWarnings()) {
                const isVerbose = process.env.IME_LOGLEVEL === 'verbose';
                if (isVerbose) {
                    logger.warn(info.warnings.join('\n'));
                    logMsg += `, 警告${info.warnings.length}次`;
                } else {
                    logMsg += `, 警告${info.warnings.length}次, --verbose 查看详情`;
                }
            }

            logger.success(logMsg);
        });
    });
};
