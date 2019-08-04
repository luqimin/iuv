/**
 * 获取webpack配置
 */
import * as path from 'path';
import * as webpack from 'webpack';

import Entry from './entry';
import Output from './output';
import Resolve from './resolve';
import Module from './module';
import Plugins from './plugins';
import Optimization from './optimization';
import DevServer from './devServer';

import getDllConfig from './dll.config';
import getSSRConfig from './ssr.config';

import { Env, smartEnv, initEnv } from './env';
import { IMEPackConfig, IMEPackOptions } from '../const/config';

/**
 * 获取webpack配置
 * @param options - 目录参数
 * @param config - ime配置
 */
export const getWebpackConfig = (
    options: IMEPackOptions,
    /**
     * ime配置
     */
    config?: IMEPackConfig
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
        module: smartEnv(Module, options, config),
        plugins: smartEnv(Plugins, options, config),
        devtool: Env.isProductuction ? false : 'cheap-module-eval-source-map',
        devServer: smartEnv(DevServer),
    };
};

/**
 * 获取webpack dll打包配置
 */
export const getDllCompilerConfig = getDllConfig;

/**
 * 获取ss打包配置
 */
export const getSSRCompilerConfig = getSSRConfig;
