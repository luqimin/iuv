/**
 * 获取项目根目录
 */

import * as fs from 'fs';
import * as path from 'path';

import { OptionDefinition } from 'command-line-args';

import { iuv as iuvConfigFromPkg } from '../../package.json';
import { configNames } from '../config';
import { readFile } from '../utils/readFile';

/**
 * iuv配置项
 */
export interface IUVProjectConfig {
    readonly plugins?: any[];
    readonly commands?: { [key: string]: { package?: string; path?: string; args?: OptionDefinition[] } };
    [configName: string]: any;
}

export interface IUVProject {
    rootPath: string;
    config?: IUVProjectConfig;
}

/**
 * 获取配置文件
 * @param curPath - 目录
 */
const getConfig = (curPath: string): IUVProjectConfig | undefined => {
    let projectConfig: IUVProjectConfig | undefined;
    const currentFiles: string[] = fs.readdirSync(curPath);

    // 从iuv配置文件获取配置信息
    for (const file of currentFiles) {
        if (configNames.includes(file)) {
            projectConfig = readFile(path.resolve(curPath, file));
            return projectConfig;
        }
    }

    // 从package.json获取配置信息
    return iuvConfigFromPkg || projectConfig;
};

export const getProjectInfo = (root?: string): IUVProject => {
    const rootPath: string = root || process.cwd();
    const config = getConfig(rootPath);

    return {
        rootPath,
        config,
    };
};
