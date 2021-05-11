import {} from 'webpack';

declare module 'webpack' {
    export interface Configuration {
        /**
         * Can be used to configure the behaviour of webpack-dev-server when
         * the webpack config is passed to webpack-dev-server CLI.
         */
        devServer?: any;
    }
}
