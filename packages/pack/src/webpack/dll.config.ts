import * as path from 'path';

import webpack from 'webpack';

import { IUVPackOptions, IUVPackConfig } from '../const/config';
import { Env, resolve, initEnv, smartEnv } from './env';
import Optimization from './optimization';
import vendors from './vendors';

/**
 * 打包client的webpack dllPlugin内容
 */
export default (options: IUVPackOptions, config?: IUVPackConfig): webpack.Configuration => {
    const cwd = options.context;

    initEnv(cwd);

    const outputFilename = config && `[name]${config.dllOutputSuffix || '_[fullhash:4]'}`;

    return {
        context: cwd,
        name: 'clientDll',
        mode: Env.isProductuction ? 'production' : 'development',
        devtool: false,
        entry: { vendor: smartEnv(vendors, config) },
        output: {
            path: path.resolve(options.clientPath!, 'dist'),
            filename: Env.isProductuction ? outputFilename + '.js' : '[name].dev.js',
            library: Env.isProductuction ? outputFilename : '[name]',
        },
        optimization: smartEnv(Optimization, config),
        plugins: [
            new webpack.DllPlugin({
                path: path.resolve(options.clientPath!, Env.isProductuction ? 'env/manifest.json' : 'env/manifest.dev.json'),
                name: Env.isProductuction ? outputFilename : '[name]',
                context: resolve(''),
            }),
        ],
    };
};
