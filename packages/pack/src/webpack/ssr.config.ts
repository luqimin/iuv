/**
 * webpack dllPlugin配置
 */
import * as path from 'path';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';

import Entry from './entry';
import Module from './ssrModule';
import Resolve from './resolve';
import ResolveLoader from './resolveLoader';

import { Env, initEnv, smartEnv } from './env';
import { IMEPackConfig, IMEPackOptions } from '../const/config';

/**
 * 打包服务端ssr文件
 */
export default (options: IMEPackOptions, config?: IMEPackConfig): webpack.Configuration => {
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
        resolve: smartEnv(Resolve, options),
        resolveLoader: smartEnv(ResolveLoader),
        devtool: false,
        externals: [nodeExternals()],
    };
};
