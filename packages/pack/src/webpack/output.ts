import * as path from 'path';
import { getVersion } from './version';

import { IMEPackConfig, IMEPackOptions } from '../const/config';

export default (options: IMEPackOptions, config: IMEPackConfig) => {
    return {
        common: {
            path: path.resolve(options.clientPath!, 'dist'),
            publicPath: config.publicPath || '/dist/',
            crossOriginLoading: 'anonymous',
        },
        production: {
            filename: config.disableUniqueOutput ? '[name].js' : `[name].${getVersion(config)}.js`,
            chunkFilename: config.disableUniqueOutput ? '[name].iuv.js' : '[name].[chunkhash:4].js',
        },
        development: {
            filename: '[name].js',
            chunkFilename: '[name].iuv.js',
        },
    };
};
