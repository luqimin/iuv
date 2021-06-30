import TerserPlugin from 'terser-webpack-plugin';

import { IUVPackConfig } from '../const/config';

export default (config: IUVPackConfig) => {
    return {
        common: {
            splitChunks: {
                cacheGroups: {
                    css: {
                        test: /\.(css|less|sass|scss)$/,
                        name: 'commons',
                        chunks: 'all',
                        minChunks: 4,
                    },
                },
            },
        },
        production: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: config.legacySupport ? 5 : 2015,
                        output: {
                            comments: /^!.+iuv.+/,
                        },
                    },
                }),
            ],
        },
        development: {},
    };
};
