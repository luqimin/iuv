import { BaseClass } from '@iuv/core';

import creatPack from './utils/packFactory';

interface Params {
    dllOnly: boolean;
}

class Builder extends BaseClass<Params> {
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
        await pack.compileClientStatic();
        await pack.clientCssCompile();
        await pack.compileServerStatic();
        await pack.compileServer();
    }
}

export default Builder;
