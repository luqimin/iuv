

declare module "clui";
declare module "react-loadable-ts-transformer";

declare module "babel-plugin-import";
declare module "@babel/plugin-proposal-class-properties";
declare module "@babel/plugin-proposal-decorators";
declare module "@babel/plugin-proposal-object-rest-spread";
declare module "@babel/plugin-proposal-optional-chaining";
declare module "@babel/plugin-syntax-dynamic-import";
declare module "@babel/plugin-transform-regenerator";
declare module "@babel/plugin-transform-runtime";
declare module "@babel/preset-env";
declare module "@babel/preset-react";
declare module "@babel/preset-typescript";
declare module "@babel/runtime";

declare module "uglifyjs-webpack-plugin";
declare module "mini-css-extract-plugin";
declare module "webpack-node-externals";

declare module "webpack-dev-server" {
    import * as http from 'http';
    import { Compiler, MultiCompiler } from 'webpack';
    export interface Configuration {
        [key: string]: any;
    }
    export class WebpackDevServer {
        sockets: NodeJS.EventEmitter[];
        constructor(webpack: Compiler | MultiCompiler, config?: Configuration);
        listen(port: number, hostname: string, callback?: (error?: Error) => void): http.Server;
        listen(port: number, callback?: (error?: Error) => void): http.Server;
        close(callback?: () => void): void;
    }
    export default WebpackDevServer
}
