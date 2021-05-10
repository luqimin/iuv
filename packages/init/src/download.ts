/**
 * 初始化项目
 */
import chalk from 'chalk';
import * as download from 'download-git-repo';
import * as path from 'path';
import * as util from 'util';

import install from './utils/install';
import { logger } from './utils/logger';
import { readFile } from './utils/readFile';
import spin from './utils/spin';

// download promisify化
download[util.promisify.custom] = (_demoUrl: string, _dest: string, option: { [key: string]: any }): Promise<void> => {
    return new Promise((resolve, reject) => {
        download(_demoUrl, _dest, option, (error: Error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};
const asyncDownload = util.promisify(download);

export default async (
    /**
     * 新项目名
     */
    project: string,
    /**
     * 安装目录
     */
    dest: string,
    /**
     * 项目git地址
     */
    git: string,
    /**
     * 模板存放位置
     */
    registry?: string,
) => {
    try {
        const downloadSpin = spin('正在初始化项目...');
        downloadSpin.start();

        try {
            await asyncDownload(git, dest, { clone: true });
        } catch (error) {
            downloadSpin.stop();
            logger.error(`项目 ${project} 下载失败, 请确认 git(${git}) 可用`);
            logger.error(`错误信息: ${error.message}`);
            return;
        }

        downloadSpin.stop();

        try {
            // 安装依赖
            logger.info('安装依赖... \n');
            const projectPackage: { [key: string]: any } = readFile(path.join(dest, 'package.json'));
            const dependencies: string[] = Object.keys(Object.assign(projectPackage.dependencies, projectPackage.devDependencies));
            await install(dest, dependencies, registry);
        } catch (error) {
            logger.error('安装依赖失败, 请稍后手动安装');
        }

        logger.success(`项目 ${project} 初始化成功, 你现在可以:`);
        console.log(`\n    $ ${chalk.cyan(`cd ${project}`)}`);
        console.log(chalk.gray(`    # 进入${project}目录`));
        console.log(`\n    $ ${chalk.cyan('npm start')}`);
        console.log(chalk.gray('    # 开启本地开发模式'));
        console.log(`\n    $ ${chalk.cyan('npm run build')}`);
        console.log(chalk.gray('    # 生产环境打包项目'));
        console.log(`\n    $ ${chalk.cyan('更多功能请查看README.md')}`);
        console.log('\n');
    } catch (error) {
        logger.error(`项目 ${project} 创建失败, 联系管理员吧: ${error.message}`);
        throw error;
    }
};
