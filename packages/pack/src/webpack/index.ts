/**
 * 获取webpack配置
 */
import { Configuration } from 'webpack';
import * as mergeFuncs from 'webpack-merge';

import { IUVPackConfig, IUVPackOptions } from '../const/config';
import getDllConfig from './dll.config';
import Entry from './entry';
import { Env, smartEnv, initEnv } from './env';
import Module from './module';
import Optimization from './optimization';
import Output from './output';
import Plugins from './plugins';
import Resolve from './resolve';
import ResolveLoader from './resolveLoader';
import getSSRConfig from './ssr.config';
import getWebpackDevServerConfig from './webpackDevServer.config';

/**
 * 获取webpack配置
 * @param options - 目录参数
 * @param config - iuv配置
 */
export const getWebpackConfig = (
    options: IUVPackOptions,
    /**
     * iuv配置
     */
    config?: IUVPackConfig,
): Configuration => {
    const cwd = options.context;
    // 初始化webpack环境
    initEnv(cwd);
    // 内置配置
    let builtInConfig: Configuration = {
        // 设置webpack上下文
        context: cwd,
        name: 'client',
        mode: Env.isProductuction ? 'production' : 'development',
        entry: Entry(options),
        output: smartEnv(Output, options, config),
        optimization: smartEnv(Optimization, config),
        resolve: smartEnv(Resolve, options),
        resolveLoader: smartEnv(ResolveLoader),
        module: smartEnv(Module, options, config),
        plugins: smartEnv(Plugins, options, config),
        devtool: Env.isProductuction ? false : 'eval-cheap-module-source-map',
        devServer: {},
    };
    // 合并用户配置
    if (config && typeof config.webpack === 'function') {
        const userConfig = config.webpack(mergeFuncs, builtInConfig);
        userConfig && (builtInConfig = userConfig);
    }

    return builtInConfig;
};

/**
 * 获取webpack dll打包配置
 */
export const getDllCompilerConfig = getDllConfig;

/**
 * 获取ss打包配置
 */
export const getSSRCompilerConfig = getSSRConfig;

/**
 * 获取webpackDevServer打包配置
 */
export const getWebpackDevServerCompilerConfig = getWebpackDevServerConfig;
