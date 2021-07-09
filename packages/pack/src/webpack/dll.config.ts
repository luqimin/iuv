import * as path from 'path';

import webpack, { Configuration } from 'webpack';
import * as mergeFuncs from 'webpack-merge';

import { IUVPackOptions, IUVPackConfig } from '../const/config';
import { Env, resolve, initEnv, smartEnv } from './env';
import Optimization from './optimization';
import vendors from './vendors';

/**
 * 打包client的webpack dllPlugin内容
 */
export default (options: IUVPackOptions, config?: IUVPackConfig): Configuration => {
    const cwd = options.context;
    initEnv(cwd);

    let outputFilename = '[name]_[fullhash:8]',
        libraryName = '[name]_[fullhash:8]';
    if (config && config.dllOutputSuffix) {
        outputFilename = `[name]${config.dllOutputSuffix}`;
        // 避免dllOutputSuffix包含非法字符
        libraryName = `[name]${config.dllOutputSuffix.replace(/\W/g, '_')}`;
    }

    // 内置配置
    let builtInConfig: Configuration = {
        context: cwd,
        name: 'clientDll',
        mode: Env.isProductuction ? 'production' : 'development',
        devtool: false,
        entry: { vendor: smartEnv(vendors, config) },
        output: {
            path: path.resolve(options.clientPath!, 'dist'),
            filename: Env.isProductuction ? outputFilename + '.js' : '[name].dev.js',
            library: Env.isProductuction ? libraryName : '[name]',
        },
        optimization: smartEnv(Optimization, config),
        plugins: [
            new webpack.DllPlugin({
                path: path.resolve(options.clientPath!, Env.isProductuction ? 'env/manifest.json' : 'env/manifest.dev.json'),
                name: Env.isProductuction ? libraryName : '[name]',
                context: resolve(''),
            }),
        ],
    };
    // 合并用户配置
    if (config && typeof config.dllWebpack === 'function') {
        const userConfig = config.dllWebpack(mergeFuncs, builtInConfig);
        userConfig && (builtInConfig = userConfig);
    }

    return builtInConfig;
};
