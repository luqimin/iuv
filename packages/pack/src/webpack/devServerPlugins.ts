import * as fs from 'fs';
import * as path from 'path';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import WebpackBar from 'webpackbar';

import { IUVPackConfig, IUVPackOptions } from '../const/config';
import getTsConfigPath from '../typescript/getConfigFile';
import logger from '../utils/logger';
import { resolve, Env, EnvObject } from './env';
import { getVersion } from './version';

export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const common: any[] = [
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/zh-cn$/),
        new webpack.BannerPlugin({
            banner: `Updated by iuv at ${new Date().toLocaleString()}`,
            entryOnly: true,
        }),
    ];

    // 当dllplugin生成的manifest文件存在时，添加dllplugin插件
    const manifestPath: string = Env.isProductuction ? 'env/manifest.json' : 'env/manifest.dev.json';
    if (fs.existsSync(path.resolve(options.clientPath!, manifestPath))) {
        common.push(
            new webpack.DllReferencePlugin({
                context: resolve(''),
                manifest: require(path.resolve(options.clientPath!, manifestPath)),
            }),
        );
    }

    const htmlPath = path.resolve(options.clientSourcePath!, '../public/index.html');
    const faviconPath = path.resolve(options.clientSourcePath!, '../public/favicon.ico');

    const production: any[] = [
        new HtmlWebpackPlugin({
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
            },
            favicon: faviconPath,
            inject: true,
            template: htmlPath,
        }),
        new MiniCssExtractPlugin({
            filename: `[name].${getVersion(config)}.css`,
            chunkFilename: '[name].[chunkhash:4].css',
        }),
    ];
    const development: any[] = [
        new HtmlWebpackPlugin({
            favicon: faviconPath,
            inject: true,
            template: htmlPath,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].iuv.css',
        }),
        new ForkTsCheckerWebpackPlugin({
            async: true,
            typescript: {
                enabled: true,
                context: resolve(''),
                configFile: getTsConfigPath(resolve('')),
                mode: 'write-tsbuildinfo',
                memoryLimit: 3000,
                configOverwrite: {
                    // 不检查server端类型
                    exclude: [options.serverSourcePath || 'node_modules'],
                },
            },
            logger: {
                issues: {
                    info: (m) => logger.log('[类型检查]', m),
                    log: (m) => logger.log('[类型检查]', m),
                    error: (m) => logger.log('[类型检查]', m),
                },
            },
        }),
        new WebpackBar({
            name: '[iuv] static resource',
            basic: false,
        }),
    ];

    const configObject: EnvObject<any[]> = {
        common,
        production,
        development,
    };

    // 合并用户配置
    if (Array.isArray(config.webpackPlugins)) {
        configObject.common = config.webpackPlugins;
        configObject.production = [];
        configObject.development = [];
    } else if (typeof config.webpackPlugins === 'function') {
        configObject.common = config.webpackPlugins(common.concat(configObject[Env.env]));
        configObject.production = [];
        configObject.development = [];
    }

    return configObject;
};
