import webpack from 'webpack';
import spin from '../utils/spin';
import logger from '../utils/logger';
import { isDevDquipment } from '../utils/platform';

/**
 * 静态文件打包
 */
export const clientCompiler = (webpackConfig: webpack.Configuration, title: string): Promise<webpack.Stats> => {
    // 开始编译
    const buildSpin = spin(`编译「${title}」js文件中...`);
    buildSpin.start();

    const compiler: webpack.Compiler = webpack(webpackConfig);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            buildSpin.stop();
            if (err) {
                logger.error(err.stack || err.message);
                if ((err as any).details) {
                    logger.error((err as any).details);
                }
                reject(err);
                return;
            }

            if (!stats) {
                logger.error('webpack stats 不存在');
                return
            }

            console.log(
                `webpack打包「${title}」结果\n` +
                    stats.toString({
                        hash: false,
                        chunks: false,
                        colors: isDevDquipment,
                        children: false,
                        modules: false,
                    })
            );
            resolve(stats);
        });
    });
};
