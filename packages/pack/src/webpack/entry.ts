/**
 * 获取入口文件
 */
import * as path from 'path';
import webpack from 'webpack';
import { pathExistsSync, readdirSync, lstatSync } from 'fs-extra';
import getName from '../utils/getEntryName';
import { IUVPackOptions } from '../const/config';

// 默认入口名
const clientEntryNames: string[] = ['index.ts', 'index.tsx', 'entry.ts', 'entry.tsx'];
// 默认入口目录
const clientEntryDirectory: string = 'entry';
// ssr默认入口名
const ssrEntryNames: string[] = ['ssr.ts', 'ssr.tsx'];
// ssr默认入口目录
const ssrEntryDirectory: string = 'ssr';

export default (options: IUVPackOptions, isSSR?: boolean): webpack.Entry => {
    const entryNames = isSSR ? ssrEntryNames : clientEntryNames;
    const entryDirectory = isSSR ? ssrEntryDirectory : clientEntryDirectory;

    // 静态文件路径
    const client: string = options.clientSourcePath!;
    const webpackEntry: { [entry: string]: string } = {};

    // 默认单入口文件
    for (const name of entryNames) {
        const entryFile: string = path.join(client, name);
        if (pathExistsSync(entryFile)) {
            webpackEntry['app'] = entryFile;
            return webpackEntry;
        }
    }

    // 多入口文件，选取entry目录内所有文件
    const entryDir: string = path.join(client, entryDirectory);
    if (!pathExistsSync(entryDir)) {
        throw new Error('webpack找不到入口文件');
    }

    // 获取入口目录下所有文件
    const entryFiles: string[] = readdirSync(entryDir);
    entryFiles.forEach((file) => {
        const filepath: string = path.resolve(entryDir, file);
        // 不是隐藏文件且不是目录
        if (lstatSync(filepath).isFile() && file.indexOf('.') !== 0) {
            webpackEntry[getName(filepath)] = filepath;
        }
    });

    return webpackEntry;
};
