import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';

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
                config.newEra
                    ? new TerserPlugin({
                          terserOptions: {
                              output: {
                                  comments: /^!.+iuv.+/,
                              },
                          },
                      })
                    : new UglifyJsPlugin({
                          uglifyOptions: {
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
