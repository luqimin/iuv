/**
 * webpack dllPlugin配置
 */
import * as path from 'path';

import { Configuration } from 'webpack';
import * as mergeFuncs from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import WebpackBar from 'webpackbar';

import { IUVPackConfig, IUVPackOptions } from '../const/config';
import Entry from './entry';
import { Env, initEnv, smartEnv } from './env';
import Resolve from './resolve';
import ResolveLoader from './resolveLoader';
import Module from './ssrModule';

/**
 * 打包服务端ssr文件
 */
export default (options: IUVPackOptions, config?: IUVPackConfig): Configuration => {
    const cwd = options.context;
    initEnv(cwd);

    // 内置配置
    let builtInConfig: Configuration = {
        context: cwd,
        name: 'ssr',
        mode: Env.isProductuction ? 'production' : 'development',
        target: 'node',
        entry: Entry(options, true),
        output: {
            path: path.resolve(options.serverPath!, 'ssr'),
            filename: '[name].js',
            chunkFilename: '[name].ssr.js',
            libraryTarget: 'commonjs2',
            libraryExport: 'default',
        },
        module: smartEnv(Module, options, config || {}),
        plugins: [
            new WebpackBar({
                name: '[iuv] ssr',
                color: 'yellow',
                basic: true,
            }),
        ],
        resolve: smartEnv(Resolve, options),
        resolveLoader: smartEnv(ResolveLoader),
        devtool: false,
        externals: [nodeExternals()],
    };
    // 合并用户配置
    if (config && typeof config.ssrWebpack === 'function') {
        const userConfig = config.ssrWebpack(mergeFuncs, builtInConfig);
        userConfig && (builtInConfig = userConfig);
    }

    return builtInConfig;
};
