/**
 * webpack dllPlugin配置
 */
import * as path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import WebpackBar from 'webpackbar';

import Entry from './entry';
import Module from './ssrModule';
import Resolve from './resolve';
import ResolveLoader from './resolveLoader';

import { Env, initEnv, smartEnv } from './env';
import { IUVPackConfig, IUVPackOptions } from '../const/config';

/**
 * 打包服务端ssr文件
 */
export default (options: IUVPackOptions, config?: IUVPackConfig): webpack.Configuration => {
    const cwd = options.context;

    initEnv(cwd);

    return {
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
        plugins: [new WebpackBar({
            name: '[iuv] ssr',
            color: 'yellow',
            basic: true,
        })],
        resolve: smartEnv(Resolve, options),
        resolveLoader: smartEnv(ResolveLoader),
        devtool: false,
        externals: [nodeExternals()],
    };
};
