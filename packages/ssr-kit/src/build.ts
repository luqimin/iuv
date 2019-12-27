import { BaseClass } from '@iuv/core';

import creatPack from './utils/packFactory';

interface Params {
    dllOnly: boolean;
}

class Builder extends BaseClass<Params> {
    protected didInit() {
        const runtime = this.runtime,
            config = this.config;

        // 当前为ssr项目
        Object.assign(this.config, {
            ssr: {
                enable: true,
                type: 'react',
            },
        });

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
            config as any
        );

        await pack.compileClientDll();

        if (this.params && this.params.dllOnly) {
            return;
        }

        await pack.compileClient();
        await pack.compileSSR();
        await pack.compileServerStatic();
        await pack.compileServer();
    }
}

export default Builder;
