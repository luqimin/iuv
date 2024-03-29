import { RuleSetRule, Configuration } from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as mergeFuncs from 'webpack-merge';

/**
 * pack示例参数接口
 */
export interface IUVPackOptions {
    /**
     * pack工作目录（上下文）
     */
    readonly context: string;

    /**
     * 前端client源码目录
     */
    clientSourcePath?: string;

    /**
     * 服务端server源码目录
     */
    serverSourcePath?: string;

    /**
     * 前端client打包后目录
     */
    clientPath?: string;

    /**
     * 服务端server打包后目录
     */
    serverPath?: string;
}

/**
 * pack额外参数接口
 */
export interface IUVPackConfig {
    /**
     * 打印调试日志
     */
    debug?: boolean;

    /**
     * 版本号，生产环境编译时，静态文件名将会携带版本号
     */
    version?: string;

    /**
     * webpack output.publicPath
     */
    publicPath?: string;

    /**
     * 兼容浏览器列表
     */
    browsers?: string[];

    /**
     * 是否兼容老旧浏览器, 默认会通过browsers计算获取（判断是不是支持const）
     */
    legacySupport?: boolean;

    /**
     * webpack dllPlugin vendors
     */
    dll?: string[];

    /**
     * webpack dllPlugin output filename
     */
    dllOutputSuffix?: string;

    /**
     * less modifyVars配置
     */
    lessModifyVars?: { [key: string]: string };

    /**
     * ssr开关
     */
    ssr?: SSR;

    /**
     * {} 可自定义配置覆盖
     */
    webpackDevServer?: WebpackDevServer.Configuration;

    /**
     * webpack plugins
     */
    webpackPlugins?: any[] | ((plugins: any[]) => any[]);

    /**
     * webpack loaders
     */
    webpackLoaders?: RuleSetRule[] | ((rules: RuleSetRule[]) => RuleSetRule[]);

    /**
     * webpack配置
     */
    webpack?: (funcs: typeof mergeFuncs, config: Configuration) => Configuration;
    dllWebpack?: (funcs: typeof mergeFuncs, config: Configuration) => Configuration;
    ssrWebpack?: (funcs: typeof mergeFuncs, config: Configuration) => Configuration;
}

interface SSR {
    enable: boolean;
    type?: 'react' | 'vue';
}

/**
 * pack默认配置参数
 */
export const DEFAULT_OPTIONS: IUVPackOptions = {
    /**
     * 上下文选取当前程序运行路径
     */
    context: process.cwd(),
};

/**
 * 继承自iuv或者额外设置的配置内容（用于覆盖pack内置webpack、babel配置）
 */
export const DEFAULT_PACK_CONFIG: IUVPackConfig = {
    browsers: ['last 2 version'],
};
