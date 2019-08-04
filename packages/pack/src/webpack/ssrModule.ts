import getTsConfigPath from '../typescript/getConfigFile';
import { IMEPackConfig, IMEPackOptions } from '../const/config';
import { Env, resolve } from './env';
import lessTheme from '../const/lessTheme';
import { getBabelConfig } from '../babel';
import { isDevDquipment } from '../utils/platform';

export default (options: IMEPackOptions, config: IMEPackConfig) => {
    const common = {
        rules: [
            {
                test: /\.(less|css)$/,
                include: [options.clientSourcePath],
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            onlyLocals: true,
                            modules: {
                                localIdentName: Env.isProductuction ? '[hash:base64:4]' : '[path][name]_[local]',
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: Object.assign(lessTheme, config.lessModifyVars),
                        },
                    },
                ],
            },
            {
                test: /\.(less|css)$/,
                exclude: [options.clientSourcePath],
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            exportOnlyLocals: true,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: Object.assign(lessTheme, config.lessModifyVars),
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|jpeg|mp4|mp3|wma|svg|eot|ttf|woff|woff2)$/,
                use: ['file-loader?limit=1000&name=files/[md5:hash:base64:10].[ext]'],
            },
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: { loader: 'babel-loader', options: getBabelConfig(resolve(''), true, config) },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader', options: getBabelConfig(resolve(''), true, config) },
                    {
                        loader: 'ts-loader',
                        options: {
                            // 生产环境仅打包不做类型check
                            transpileOnly: Env.isProductuction,
                            configFile: getTsConfigPath(resolve('')),
                            context: resolve(''),
                            colors: isDevDquipment,
                        },
                    },
                ],
            },
        ],
    };

    return {
        common,
        production: {},
        development: {},
    };
};
