import * as path from 'path';
import { getVersion } from './version';

import { IMEPackConfig, IMEPackOptions } from '../const/config';

export default (options: IMEPackOptions, config: IMEPackConfig) => {
    return {
        common: {
            path: path.resolve(options.clientPath!, 'dist'),
            crossOriginLoading: 'anonymous',
        },
        production: {
            filename: config.disableUniqueOutput ? '[name].js' : `[name].${getVersion(config)}.js`,
            chunkFilename: config.disableUniqueOutput ? '[name].ime.js' : '[name].[chunkhash:4].js',
            publicPath: config.publicPath || '/dist/',
        },
        development: {
            filename: '[name].js',
            chunkFilename: '[name].ime.js',
            publicPath: '/dist/',
        },
    };
};
