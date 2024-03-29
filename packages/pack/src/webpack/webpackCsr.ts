/**
 * 静态类型项目webpack配置，内置deServer, webpackHtmlPlugin
 */
import { Configuration } from 'webpack';
import * as mergeFuncs from 'webpack-merge';

import { IUVPackConfig, IUVPackOptions } from '../const/config';
import DevServer from './devServer';
import Plugins from './devServerPlugins';
import Entry from './entry';
import { Env, smartEnv, initEnv } from './env';
import Module from './module';
import Optimization from './optimization';
import Output from './output';
import Resolve from './resolve';
import ResolveLoader from './resolveLoader';

/**
 * 获取webpack配置
 * @param options - 目录参数
 * @param config - iuv配置
 */
export default (
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
        // target: 'web',
        mode: Env.isProductuction ? 'production' : 'development',
        entry: Entry(options),
        output: smartEnv(Output, options, config),
        optimization: smartEnv(Optimization, config),
        resolve: smartEnv(Resolve, options),
        resolveLoader: smartEnv(ResolveLoader),
        module: smartEnv(Module, options, config),
        plugins: smartEnv(Plugins, options, config),
        devtool: Env.isProductuction ? false : 'eval-cheap-module-source-map',
        devServer: smartEnv(DevServer, options, config),
    };
    // 合并用户配置
    if (config && typeof config.webpack === 'function') {
        const userConfig = config.webpack(mergeFuncs, builtInConfig);
        userConfig && (builtInConfig = userConfig);
    }

    return builtInConfig;
};
