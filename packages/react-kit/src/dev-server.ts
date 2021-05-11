import * as fs from 'fs';

import { BaseClass } from '@iuv/core';

import Builder from './build';
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
    }
}

export default DevServer;
