/**
 * 获取webpack配置
 */
import * as webpack from 'webpack';

import Entry from './entry';
import Output from './output';
import Resolve from './resolve';
import ResolveLoader from './resolveLoader';
import Module from './module';
import Plugins from './devServerPlugins';
import Optimization from './optimization';
import DevServer from './devServer';

import { Env, smartEnv, initEnv } from './env';
import { IUVPackConfig, IUVPackOptions } from '../const/config';

/**
 * 获取webpack配置
 * @param options - 目录参数
 * @param config - iuv配置
 */
export const getWebpackDevServerConfig = (
    options: IUVPackOptions,
    /**
     * iuv配置
     */
    config?: IUVPackConfig
): webpack.Configuration => {
    const cwd = options.context;

    // 初始化webpack环境
    initEnv(cwd);

    return {
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
        devtool: Env.isProductuction ? false : 'cheap-module-eval-source-map',
        devServer: smartEnv(DevServer, options, config),
    };
};
