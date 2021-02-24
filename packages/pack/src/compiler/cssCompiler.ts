/**
 * css打包
 * 目前仅支持less postcss
 */
import * as Path from 'path';
import * as less from 'less';
import postcss, { ProcessOptions } from 'postcss';
import {pathExistsSync, writeFileSync, readFileSync, readdirSync, lstatSync} from 'fs-extra';
import logger from '../utils/logger';
import mkdirs from '../utils/mkdirs';
import { Env } from '../webpack/env';
import { IUVPackOptions, IUVPackConfig } from '../const/config';
import lessTheme from '../const/lessTheme';
import postcssPlugins from '../webpack/postcss';
import { getVersion } from '../webpack/version';

export const cssCompiler = (options: IUVPackOptions, config: IUVPackConfig): any => {
    const source = Path.resolve(options.clientSourcePath!, 'style');
    const dest = Path.resolve(options.clientPath!, 'style');

    if (!pathExistsSync(source)) {
        return;
    }

    // 编译less文件
    const lessCompileSingle = async (file: string) => {
        // 开始编译
        logger.info(`样式 文件${file}编译中...`);
        const sourceFilePath = Path.resolve(source, file);
        let destFilePath = Path.resolve(dest, file);
        // 添加版本号
        const version = Env.isDevelopment ? '.css' : `.${getVersion(config)}.css`;
        destFilePath = destFilePath.replace(Path.extname(destFilePath), version);

        const lessOption: Less.Options = {
            filename: sourceFilePath,
            modifyVars: Object.assign(lessTheme, config.lessModifyVars),
        };
        if (Env.isDevelopment) {
            lessOption.sourceMap = {
                sourceMapFileInline: true,
            };
        }
        const fileString = readFileSync(sourceFilePath, 'utf-8');
        // 编译less
        less.render(fileString, lessOption)
            .then( (lessRes) => {
                const postOption: ProcessOptions = {
                    from: sourceFilePath,
                    to: destFilePath,
                };
                // if (Env.isDevelopment) {
                //     postOption.map = {
                //         inline: true,
                //     };
                // }
                // postcss 插件
                const postPlugin = postcssPlugins(config);
                // 编译postcss
                return postcss(postPlugin).process(lessRes.css, postOption);
            })
            .then((postRes) => {
                // 创建目录
                mkdirs(Path.dirname(destFilePath));
                // 写入文件
                writeFileSync(destFilePath, postRes.css, 'utf8');
                logger.info(`样式 文件${file}编译结束`);
            })
            .catch( (err) => {
                logger.info(`样式 文件${file}编译出错`);
                logger.error(err);
            });

    };

    const compileAll = () => {
        // 获取入口目录下所有文件
        const entryFiles: string[] = readdirSync(source);
        entryFiles.forEach((file) => {
            const filepath: string = Path.resolve(source, file);
            // 不是隐藏文件且不是目录且不以_开头
            if (lstatSync(filepath).isFile() && file.indexOf('.') !== 0 && file.substr(0, 1) !== '_') {
                lessCompileSingle(file);
            }
        });
    };
    return {
        all: compileAll,
        single: lessCompileSingle,
    };
};
