import { BaseClass } from '@iuv/core';
import { CommandLineOptions } from 'command-line-args';

import { getOptions } from '../../utils/args';
import defineEnv from '../../utils/defineEnv';
import install from '../../utils/install';
import safelyRequire from '../../utils/safelyRequire';

interface ExecuteClassParams {
    root?: string;
    /**
     * 命令名
     */
    cmd: string;
}

class ExecuteClass extends BaseClass<ExecuteClassParams> {
    async running() {
        const { cmd } = this.params!;
        const { commands = {} } = this.config;

        const cmdConfig = commands[cmd];

        if (!cmdConfig) {
            this.logger.warn(`iuv 配置文件内没有找到 ${cmd} 的配置参数, 请检查配置参数是否正确`);
            return;
        }

        const cmdSrc = cmdConfig.package || cmdConfig.path || '';

        if (cmdSrc) {
            const cmdOptions = cmdConfig.args || [];

            const options: CommandLineOptions = getOptions(cmdOptions);

            // 设置环境变量
            defineEnv(options && options.env);

            try {
                let cmdClass = safelyRequire(cmdSrc);

                // 当命令为包且包不存在时，尝试自动安装包
                if (!cmdClass && cmdConfig.package) {
                    this.logger.warn(`初始化 ${cmdSrc} 模块...`);
                    await install(this.runtime.rootPath, cmdSrc, (options && options.registry) || '');
                    cmdClass = safelyRequire(cmdSrc);
                }

                if (typeof cmdClass === 'function') {
                    const cmdInstance: BaseClass<any> = new cmdClass(options);

                    // 运行命令
                    cmdInstance.start && cmdInstance.start();
                } else {
                    this.logger.error(`命令 ${cmd} 的模块不是 class, 无法实例化`);
                }
            } catch (error) {
                this.logger.error(`找不到命令 ${cmd} 的模块, 请检查配置参数是否正确`);
            }
        }
    }
}

export default ExecuteClass;
