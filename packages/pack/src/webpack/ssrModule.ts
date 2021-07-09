import { getBabelConfig } from '../babel';
import { IUVPackConfig, IUVPackOptions } from '../const/config';
import lessTheme from '../const/lessTheme';
import getTsConfigPath from '../typescript/getConfigFile';
import { isDevDquipment } from '../utils/platform';
import { Env, resolve } from './env';

export default (options: IUVPackOptions, config: IUVPackConfig) => {
    const common = {
        rules: [
            {
                test: /\.(less|css)$/,
                include: [options.clientSourcePath],
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                exportOnlyLocals: true,
                                localIdentName: Env.isProductuction ? '[contenthash:base64:8]' : '[path][name]_[local]',
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: Object.assign(lessTheme, config.lessModifyVars),
                            },
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
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: Object.assign(lessTheme, config.lessModifyVars),
                            },
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

    return {
        common,
        production: {},
        development: {},
    };
};
