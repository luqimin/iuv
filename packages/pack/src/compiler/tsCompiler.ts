/**
 * 打包ts文件
 */

import * as fs from 'fs-extra';
import * as ts from 'typescript';
import getConfigPath from '../typescript/getConfigFile';
import logger, { addColor } from '../utils/logger';

/**
 * ts文件打包方法
 * @param context - 上下文
 * @param configName - tsconfig文件名
 * @returns - 是否打包成功
 */
export const tsCompiler = (context: string, configName?: string): boolean => {
    const configPath = getConfigPath(context, configName);
    if (!configPath) {
        throw new Error(`找不到合法的typescript配置文件'${configName || 'tsconfig.json'}'`);
    }

    // 从tsconfig.json中获取ts配置
    const configParseResult = ts.parseJsonConfigFileContent(
        fs.readJsonSync(configPath, { encoding: 'utf8' }),
        ts.sys,
        context
    );

    logger.info('TS 编译中...');

    const program = ts.createProgram(configParseResult.fileNames, configParseResult.options);
    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            logger.error(
                addColor(`TS Error ${diagnostic.code}`, 'gray'),
                `${diagnostic.file.fileName} (${line + 1}:${character + 1})`,
                ':',
                ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)
            );
        } else {
            logger.info(`TS ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)}`);
        }
    });

    const compiled: boolean = !emitResult.emitSkipped;
    if (compiled) {
        logger.info('TS 编译结束');
    } else {
        logger.error('TS 编译出错');
    }

    return compiled;
};
