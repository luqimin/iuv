/**
 * egg-ts-helper
 */
import spawn from 'cross-spawn';

import { BaseClass } from '@iuv/core';

class ETS extends BaseClass<any> {
    protected async running() {
        const { rootPath } = this.runtime,
            config = this.config;

        if (config && config.ets && config.ets.enable !== false) {
            const ets = spawn('npx', ['ets', '-w', '-c', './server'], { cwd: rootPath });
            ets.stdout &&
                ets.stdout.on('data', (data) => {
                    console.log(data + '');
                });
        }
    }
}

export default ETS;
