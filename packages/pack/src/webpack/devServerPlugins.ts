import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

import { resolve, Env, EnvObject } from './env';
import { getVersion } from './version';
import { IUVPackConfig, IUVPackOptions } from '../const/config';

export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const common = [
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
            })
        );
    }

    const htmlPath = path.resolve(options.clientSourcePath!, '../public/index.html');
    const faviconPath = path.resolve(options.clientSourcePath!, '../public/favicon.ico');

    const production: webpack.Plugin[] = [
        new HtmlWebpackPlugin(
            {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                },
                favicon: faviconPath,
                inject: true,
                template: htmlPath,
            },
        ),
        new webpack.NamedModulesPlugin(),
        new MiniCssExtractPlugin({
            filename: config.disableUniqueOutput ? '[name].css' : `[name].${getVersion(config)}.css`,
            chunkFilename: config.disableUniqueOutput ? '[name].iuv.css' : '[name].[chunkhash:4].css',
        }),
    ];
    const development: webpack.Plugin[] = [
        new HtmlWebpackPlugin(
              {
                favicon: faviconPath,
                inject: true,
                template: htmlPath,
              },
        ),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].iuv.css',
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
