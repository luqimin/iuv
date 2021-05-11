import * as Path from 'path';

import { IUVPackConfig, IUVPackOptions } from '../const/config';

const publicPath = '/dist';

/**
 * webpack dev server 配置
 */
export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const newConfig = Object.assign(
        {
            index: 'index.html',
            contentBase: Path.join(options.clientPath!, 'dist'),
            host: '127.0.0.1',
            port: 8080,
            inline: true,
            hot: true,
            watchContentBase: true,
            disableHostCheck: true,
            stats: 'minimal',
            historyApiFallback: true,
            publicPath,
        },
        config.webpackDevServer || {},
    );
    return {
        common: newConfig,
        production: newConfig,
        development: newConfig,
    };
};
