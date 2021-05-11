#!/usr/bin/env node

import * as path from 'path';

import chalk from 'chalk';
import program from 'commander';

import install from '../utils/install';
import { logger } from '../utils/logger';
import safelyRequire from '../utils/safelyRequire';

const INIT_MODULE_ID = '@iuv/init';

program
    .usage('[project]')
    .option('-r, --registry [registry]', '修改 npm registry')
    .action(async (project: string): Promise<void> => {
        // 设置环境变量
        const projectName = typeof project === 'string' ? project : '';
        let InitClass = safelyRequire(INIT_MODULE_ID);

        if (!InitClass) {
            logger.warn(`初始化 ${INIT_MODULE_ID} 模块...`);
            await install(path.resolve(__dirname, '../../'), INIT_MODULE_ID, program.opts().registry);
            InitClass = safelyRequire(INIT_MODULE_ID);
        }

        new InitClass({ project: projectName, registry: program.opts().registry }).start();
    });

program.on('--help', () => {
    console.log('\n  举个栗子:\n');
    console.log(chalk.gray('    # 创建一个巨大的工程'));
    console.log('    $ i init example  在当前目录创建 example 文件夹并初始化项目\n');
});

program.parse(process.argv);
