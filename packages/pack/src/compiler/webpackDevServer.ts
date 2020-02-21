import * as webpack from 'webpack';
import spin from '../utils/spin';
import logger from '../utils/logger';
import { isDevDquipment } from '../utils/platform';
import * as WebpackDevServer from 'webpack-dev-server';

/**
 * 启动webapckDevServer
 */
export const webpackDevServer =
(webpackConfig: webpack.Configuration, type: 'build' | 'server', title?: string): Promise<webpack.Stats> | void => {
    const buildSpin = type === 'server' ? spin('启动webpackDevServer中...') : spin(`编译「${title}」js文件中...`);
    buildSpin.start();
    if (type === 'build') {
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
    } else if (type === 'server') {
        const compiler: webpack.Compiler = webpack(webpackConfig);
        const devServerOptions = Object.assign({}, webpackConfig.devServer, {
            stats: {
                colors: true,
            },
        });
        const server = new WebpackDevServer(compiler, devServerOptions);
        const { host, port } = devServerOptions;
        server.listen(port!, host!, (err) => {
            buildSpin.stop();
            if (err) {
                console.log(err);
                return;
            }
            console.log(`Starting server on http://${host}:${port}`);
        });
    }
};
