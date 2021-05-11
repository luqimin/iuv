import * as fs from 'fs';
import * as path from 'path';

import * as inquirer from 'inquirer';
import { find } from 'lodash';

import { BaseClass } from '@iuv/core';

import { ssrDemoUrl } from './config';
import InitProject from './download';

const PROJECT_TYPES = [
    { name: 'react同构项目', value: 'ssr' },
    { name: '自定义(需提供git地址)', value: 'git' },
];

interface InitParams {
    project: string;
    registry?: string;
}
class Init extends BaseClass<InitParams> {
    async running() {
        /**
         * 打开用户交互界面
         */
        const promt = async () => {
            const answers = await inquirer.prompt<{ project: string; type: 'normal' | 'ssr' | 'git'; git?: string }>([
                {
                    name: 'project',
                    type: 'input',
                    message: '项目名(英文/数字/短横/下划线)',
                    default: this.params.project || undefined,
                    validate: (input) => {
                        const reg = /^[\w-_]+$/gi;
                        return reg.test(input);
                    },
                },
                {
                    name: 'type',
                    type: 'list',
                    message: '项目类型',
                    choices: PROJECT_TYPES,
                    default: 'ssr',
                },
            ]);

            // 如果选择自定义项目，需要输入git地址
            if (answers.type === 'git') {
                const gitAnswer = await inquirer.prompt<{ git: string }>([
                    {
                        name: 'git',
                        type: 'input',
                        message: '模板 git http 地址',
                        default: 'github:luqimin/iuv-ssr-template#master',
                        validate: (input) => {
                            const reg = /^github?:.+\/.+#.+/gi;
                            return reg.test(input);
                        },
                    },
                ]);
                answers.git = gitAnswer.git;
            }

            console.log('\n');

            const confirmAnswer = await inquirer.prompt<{ confirm: boolean }>({
                name: 'confirm',
                type: 'confirm',
                message:
                    '确认这些选择? \n' +
                    `新建目录: ${answers.project}\n` +
                    `项目类型: ${find(PROJECT_TYPES, (o) => o.value === answers.type)!.name}\n` +
                    (answers.git ? `模板git: ${answers.git}` : ''),
            });

            if (confirmAnswer.confirm) {
                const { project, type: projectType } = answers;

                const dest = path.resolve(this.runtime.rootPath, project);

                if (fs.existsSync(dest)) {
                    this.logger.error(`当前目录下已存在 ${project} 目录`);
                    return;
                }

                if (projectType === 'normal') {
                    this.logger.warn('暂不支持普通项目初始化，建议尝试ssr同构方案');
                    return;
                }

                if (projectType === 'ssr') {
                    // ssr项目
                    await InitProject(project, dest, ssrDemoUrl, this.params.registry);
                } else {
                    // 其他自定义项目
                    if (!answers.git) {
                        this.logger.error('缺少git地址');
                        return;
                    }
                    await InitProject(project, dest, answers.git, this.params.registry);
                }
            } else {
                promt();
            }
        };

        promt();
    }
}

export default Init;
