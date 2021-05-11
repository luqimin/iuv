import * as path from 'path';

import { IUVPackConfig, IUVPackOptions } from '../const/config';
import { getVersion } from './version';

export default (options: IUVPackOptions, config: IUVPackConfig) => {
    return {
        common: {
            path: path.resolve(options.clientPath!, 'dist'),
            crossOriginLoading: 'anonymous',
            assetModuleFilename: 'files/[hash][ext][query]',
        },
        production: {
            filename: config.disableUniqueOutput ? '[name].js' : `[name].${getVersion(config)}.js`,
            chunkFilename: config.disableUniqueOutput ? '[name].iuv.js' : '[name].[chunkhash:4].js',
            publicPath: config.publicPath || '/dist/',
        },
        development: {
            filename: '[name].js',
            chunkFilename: '[name].iuv.js',
            publicPath: config.publicPath || '/dist/',
        },
    };
};
