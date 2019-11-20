import { BaseClass } from '@iuv/core';
import * as fs from 'fs';

import Builder from './build';
import ETS from './ets';
import Server from './server';
import creatPack from './utils/packFactory';

class DevServer extends BaseClass<any> {
    protected async running() {
        const runtime = this.runtime,
            config = this.config;

        // 将ime相关路径写进环境变量
        runtime.rootPath && (process.env.IME_PATH = runtime.rootPath);
        config.clientPath && (process.env.IME_CLIENT_PATH = config.clientPath);
        config.serverPath && (process.env.IME_SERVER_PATH = config.serverPath);
        config.ssr = {
            enable: true,
            type: 'react',
        };

        const pack = creatPack(
            {
                context: runtime.rootPath,
                clientPath: config.clientPath,
                clientSourcePath: config.clientSourcePath,
                serverPath: config.serverPath,
                serverSourcePath: config.serverSourcePath,
            },
            config as any
        );

        if (!fs.existsSync(config.clientPath!) || !fs.existsSync(config.serverPath!)) {
            // 打包所需文件
            this.logger.info('打包「dll」');
            await new Builder({ dllOnly: true }).start();
        }

        // egg-ts-helper
        await new ETS({}).start();

        // 服务端资源文件
        pack.watchServerStatic();

        this.logger.warn('项目运行前需要打包「client、ssr」，请稍后...');
        await Promise.all([pack.watchClient(), pack.watchSSR()]);
        this.logger.success('打包「client、ssr」结束');

        pack.watchServer();

        // 启动服务
        new Server().start();
    }
}

export default DevServer;
