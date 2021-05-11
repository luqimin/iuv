#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { logger } from '../utils/logger';

import ExecuteClass from '../lib/exec';
import { localVersion } from '../utils/version';

const program = new Command();

program
    .version(localVersion)
    .allowUnknownOption(true)
    .exitOverride()
    .option('-e, --env [env]', '设置 NODE_ENV (production/development), 可简写')
    .option('-w, --root [root]', '设置命令执行工作目录')
    .command('init', '初始化一个新的iuv项目')
    .alias('new');

program
    .command('exec <cmd>')
    .alias('run')
    .description('执行iuv配置文件内相关命令')
    .allowUnknownOption()
    .action((cmd: string, options) => {
        new ExecuteClass({ root: program.opts().root, cmd }).start();
    });

program.configureOutput({
    writeErr: (str) => {
        const cmdReg = /unknown command '(\w+)'/;
        if (cmdReg.test(str)) {
            const match = str.match(cmdReg);
            const cmdStr = match ? match[1] : '??';
            logger.info(`${cmdStr} 为非内置命令, 将调用用户自定义方法 commands.${cmdStr}`);
        } else {
            logger.error(str);
        }
    },
    writeOut: (str) => {
        logger.info(str);
    },
});

(function parseProcess() {
    try {
        program.parse(process.argv);
    } catch (error) {}
    const args = program.args;
    if (args.length < 1) {
        // 命令敲错则直接显示帮助信息
        console.log(
            ` ${chalk.gray('请输入你想执行的命令:\n\n')}`,
            ` $ i init <project> ${chalk.gray('          # 初始化新的项目')}\n`,
            ` $ i exec <cmd> ${chalk.gray('              # 执行自定义命令')}\n\n`,
            `${chalk.gray('你还可以查看具体帮助信息, e.g.')} $ i init --help\n`,
        );
    } else if (args.length === 1) {
        // 执行命令
        const arg = args[0];
        if (['init', 'new', 'exec', 'run'].includes(arg)) {
            return;
        }
        // 执行自定义命令
        new ExecuteClass({ root: program.opts().root, cmd: arg }).start();
    }
})();
