import * as webpack from 'webpack';
import * as extend from 'extend';
import { getWebpackConfig, getDllCompilerConfig, getSSRCompilerConfig } from './webpack';

import { clientCompiler } from './compiler/clientCompiler';
import { clinetStaticCompiler } from './compiler/clientStaticCompiler';
import { cssCompiler } from './compiler/cssCompiler';
import { serverStaticCompiler } from './compiler/serverStaticCompiler';
import { tsCompiler } from './compiler/tsCompiler';
import { clientWatcher } from './compiler/clientWatcher';
import { clientStaticWatcher } from './compiler/clientStaticWatcher';
import { cssWatcher } from './compiler/cssWatcher';
import { tsWatcher } from './compiler/tsWatcher';
import { serverStaticWatcher } from './compiler/serverStaticWatcher';

import { DEFAULT_OPTIONS, DEFAULT_PACK_CONFIG, IUVPackOptions, IUVPackConfig } from './const/config';

export default class IUVPack {
    /**
     * pack参数，用于全局配置
     */
    protected options: IUVPackOptions;

    /**
     * pack配置 用户不同任务额外配置参数
     */
    protected config: IUVPackConfig;

    /**
     * 项目根目录
     */
    protected context: string;

    constructor(options: IUVPackOptions, config?: IUVPackConfig) {
        this.options = extend(true, {}, DEFAULT_OPTIONS, options);
        this.config = extend(true, {}, DEFAULT_PACK_CONFIG, config);

        // 将browsers配置写入环境变量
        if (this.config && this.config.browsers) {
            process.env.BROWSERSLIST = this.config.browsers.join(',');
        }

        this.context = this.options.context;
    }

    /**
     * 打包client
     */
    public compileClient(): Promise<webpack.Stats> {
        const webpackConfig: webpack.Configuration = getWebpackConfig(this.options, this.config);
        return clientCompiler(webpackConfig, 'client');
    }

    /**
     * 打包client静态资源(image等)
     */
    public compileClientStatic(): Promise<void[]> {
        return clinetStaticCompiler(this.options);
    }

    /**
     * 打包css
     */
    public clientCssCompile(): void {
        return cssCompiler(this.options, this.config).all();
    }

    /**
     * 打包client dll
     */
    public compileClientDll(): Promise<webpack.Stats> {
        const webpackConfig: webpack.Configuration = getDllCompilerConfig(this.options, this.config);
        return clientCompiler(webpackConfig, 'client dll');
    }

    /**
     * 打包服务端所需ssr内容
     */
    public compileSSR(): Promise<webpack.Stats> {
        const webpackConfig: webpack.Configuration = getSSRCompilerConfig(this.options, this.config);
        return clientCompiler(webpackConfig, 'ssr');
    }

    /**
     * 打包server
     */
    public compileServer() {
        return tsCompiler(this.options.context, 'tsconfig.server.json');
    }

    /**
     * 打包服务端除ts外静态文件(ejs等)
     */
    public compileServerStatic(): Promise<void[]> {
        return serverStaticCompiler(this.options);
    }

    /**
     * watch client
     */
    public watchClient(): Promise<void> {
        const webpackConfig: webpack.Configuration = getWebpackConfig(this.options, this.config);
        return clientWatcher(webpackConfig, 'client');
    }

    /**
     * watch client样式文件
     */
    public watchCss(): void {
        cssWatcher(this.options, this.config);
    }

    /**
     * watch client静态文件
     */
    public watchClientStatic(): void {
        clientStaticWatcher(this.options);
    }

    /**
     * watch ssr
     */
    public watchSSR(): Promise<void> {
        const webpackConfig: webpack.Configuration = getSSRCompilerConfig(this.options, this.config);
        return clientWatcher(webpackConfig, 'ssr');
    }

    /**
     * watch server
     */
    public watchServer(): void {
        tsWatcher(this.options.context, 'tsconfig.server.json');
    }

    /**
     * watch server静态文件
     */
    public watchServerStatic(): void {
        serverStaticWatcher(this.options);
    }
}

/**
 * 导出IUVPack实例
 */
export const Pack = IUVPack;

/**
 * 导出配置参数类型定义
 */
export { IUVPackOptions, IUVPackConfig };
