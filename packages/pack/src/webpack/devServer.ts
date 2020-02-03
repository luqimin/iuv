
import { IUVPackConfig, IUVPackOptions } from '../const/config';
import * as Path from 'path';

const publicPath = '/dist';

/**
 * webpack dev server 配置
 */
export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const _config = Object.assign({
        index: `${publicPath}/index.html`,
        contentBase: Path.join(options.clientPath!),
        host: '127.0.0.1',
        port: 8080,
        inline: true,
        hot: true,
        watchContentBase: true,
        disableHostCheck: true,
        stats: 'minimal',
        publicPath,
    }, config.webpackDevServer || {});
    return {
        common: _config,
        production: _config,
        development: _config,
    };
};
