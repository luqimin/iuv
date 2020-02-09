import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { resolve, Env, EnvObject } from './env';
import { getVersion } from './version';
import { IUVPackConfig, IUVPackOptions } from '../const/config';

export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const common: webpack.Plugin[] = [
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/zh-cn$/),
        new webpack.BannerPlugin({
            banner: `Updated by iuv at ${new Date().toLocaleString()}`,
            entryOnly: true,
        }),
    ];

    if (config.ssr && config.ssr.enable === true) {
        // 添加Loadable Components插件
        try {
            const LoadablePlugin = require(resolve('node_modules', '@loadable', 'webpack-plugin'));
            common.push(new LoadablePlugin({
                filename: '../../server/ssr/loadable-stats.json',
            }) as webpack.Plugin);
        } catch (error) {}
    }

    // 当dllplugin生成的manifest文件存在时，添加dllplugin插件
    const manifestPath: string = Env.isProductuction ? 'env/manifest.json' : 'env/manifest.dev.json';
    if (fs.existsSync(path.resolve(options.clientPath!, manifestPath))) {
        common.push(
            new webpack.DllReferencePlugin({
                context: resolve(''),
                manifest: require(path.resolve(options.clientPath!, manifestPath)),
            })
        );
    }

    const production: webpack.Plugin[] = [
            new MiniCssExtractPlugin({
                filename: config.disableUniqueOutput ? '[name].css' : `[name].${getVersion(config)}.css`,
                chunkFilename: config.disableUniqueOutput ? '[name].iuv.css' : '[name].[chunkhash:4].css',
                ignoreOrder: true,
            }),
        ],
        development: webpack.Plugin[] = [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].iuv.css',
                ignoreOrder: true,
            }),
        ];

    const configObject: EnvObject<webpack.Plugin[]> = {
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
