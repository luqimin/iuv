import * as path from 'path';
import * as webpack from 'webpack';

import vendors from './vendors';
import Optimization from './optimization';

import { Env, resolve, initEnv, smartEnv } from './env';
import { IUVPackOptions, IUVPackConfig } from '../const/config';

/**
 * 打包client的webpack dllPlugin内容
 */
export default (options: IUVPackOptions, config?: IUVPackConfig): webpack.Configuration => {
    const cwd = options.context;

    initEnv(cwd);

    const outputFilename = config && config.dllOutputSuffix ? `[name]${config.dllOutputSuffix}.js` : '[name].js';

    return {
        context: cwd,
        name: 'clientDll',
        mode: Env.isProductuction ? 'production' : 'development',
        devtool: false,
        entry: { vendor: smartEnv(vendors, config) },
        output: {
            path: path.resolve(options.clientPath!, 'dist'),
            filename: Env.isProductuction ? outputFilename : '[name].dev.js',
            library: '[name]',
        },
        optimization: smartEnv(Optimization, config),
        plugins: [
            new webpack.DllPlugin({
                path: path.resolve(
                    options.clientPath!,
                    Env.isProductuction ? 'env/manifest.json' : 'env/manifest.dev.json'
                ),
                name: '[name]',
                context: resolve(''),
            }),
        ],
    };
};
