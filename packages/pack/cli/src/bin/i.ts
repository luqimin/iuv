#!/usr/bin/env node

import chalk from 'chalk';
import program from 'commander';

import ExecuteClass from '../lib/exec';
import { localVersion } from '../utils/version';

program
    .version(localVersion)
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

program.on('--help', () => {
    console.log(chalk.gray('\n  请输入你想执行的命令:\n'));

    console.log(`    $ i init <project> ${chalk.gray('          # 初始化新的项目')}`);
    console.log(`    $ i exec <cmd> ${chalk.gray('              # 执行自定义命令')}`);

    console.log(`${chalk.gray('\n  你还可以查看具体帮助信息, e.g.')} $ i init --help`);

    console.log('\n');
});

(function activeHelp() {
    program.parse(process.argv);
    const args = program.args;
    if (args.length < 1) {
        // 命令敲错则直接显示帮助信息
        return program.help();
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
