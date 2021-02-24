import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ModuleOptions, RuleSetRule } from 'webpack';

import getTsConfigPath from '../typescript/getConfigFile';
import { IUVPackConfig, IUVPackOptions } from '../const/config';
import { Env, resolve } from './env';
import lessTheme from '../const/lessTheme';
import postcssPlugins from './postcss';
import { getBabelConfig } from '../babel';
import { isDevDquipment } from '../utils/platform';

export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const common: ModuleOptions = {
        rules: [
            {
                test: /\.(less|css)$/,
                include: [options.clientSourcePath!],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: Env.isProductuction ? '[contenthash:base64:4]' : '[path][name]_[local]',
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: postcssPlugins(config),
                            }
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: Object.assign(lessTheme, config.lessModifyVars),
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(less|css)$/,
                exclude: [options.clientSourcePath!],
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: postcssPlugins(config),
                            }
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: Object.assign(lessTheme, config.lessModifyVars),
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|jpeg|mp4|mp3|wma|svg|eot|ttf|woff|woff2)$/,
                type: 'asset/resource',
                // use: ['file-loader?limit=1000&name=files/[md5:hash:base64:10].[ext]'],
            },
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: { loader: 'babel-loader', options: getBabelConfig(resolve(''), false, config) },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader', options: getBabelConfig(resolve(''), false, config) },
                    {
                        loader: 'ts-loader',
                        options: {
                            // 生产环境仅打包不做类型check
                            transpileOnly: true,
                            configFile: getTsConfigPath(resolve('')),
                            context: resolve(''),
                            colors: isDevDquipment,
                        },
                    },
                ],
            },
        ],
    };

    // 合并用户配置
    if (Array.isArray(config.webpackLoaders)) {
        common.rules = config.webpackLoaders;
    } else if (typeof config.webpackLoaders === 'function') {
        common.rules = config.webpackLoaders(common.rules as RuleSetRule[]);
    }

    return {
        common,
        production: {},
        development: {},
    };
};
