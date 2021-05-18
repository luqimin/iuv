/* eslint-disable no-fallthrough */
import * as fs from 'fs';
import http from 'http';

import { BaseClass } from '@iuv/core';

import Builder from './build';
import mockServer from './server';
import creatPack from './utils/packFactory';

class DevServer extends BaseClass<any> {
    protected didInit() {
        const runtime = this.runtime,
            config = this.config;

        // 将iuv相关路径写进环境变量
        runtime.rootPath && (process.env.IUV_PATH = runtime.rootPath);
        config.clientPath && (process.env.IUV_CLIENT_PATH = config.clientPath);
        config.serverPath && (process.env.IUV_SERVER_PATH = config.serverPath);
    }

    private runMock() {
        const server = mockServer(this.config.clientPath);

        const port = '9527';

        const onError = (error: any) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            switch (error.code) {
                case 'EACCES': {
                    this.logger.error(`监听 ${port} 端口需要 root 权限, 尝试 sudo 重新运行`);
                    process.exit(1);
                }
                case 'EADDRINUSE': {
                    this.logger.error(`${port} 端口被占用`);
                    process.exit(2);
                }
                default: {
                    throw error;
                }
            }
        };
        const onListening = () => {
            this.logger.success(`本地mock服务开始运行, 监听端口: ${port}`);
        };

        server.set('port', port);

        http.createServer(server).listen(port).on('error', onError).on('listening', onListening);
    }

    protected async running() {
        const runtime = this.runtime,
            config = this.config;

        const pack = creatPack(
            {
                context: runtime.rootPath,
                clientPath: config.clientPath,
                clientSourcePath: config.clientSourcePath,
                serverPath: config.serverPath,
                serverSourcePath: config.serverSourcePath,
            },
            config as any,
        );

        if (!fs.existsSync(config.clientPath!) || !fs.existsSync(config.serverPath!)) {
            // 打包所需文件
            this.logger.info('打包「dll」');
            await new Builder({ dllOnly: true }).start();
        }

        pack.webpackDevServer();

        this.runMock();
    }
}

export default DevServer;
