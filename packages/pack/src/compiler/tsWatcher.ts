/**
 * typescript watcher
 */

import * as fs from 'fs-extra';
import * as ts from 'typescript';
import getConfigPath from '../typescript/getConfigFile';
import logger, { addColor } from '../utils/logger';

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (_path) => _path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};

const reportDiagnostic = (diagnostic: ts.Diagnostic): void => {
    if (!diagnostic.file) {
        logger.error(
            addColor(`TS Error ${diagnostic.code}`, 'gray'),
            ':',
            ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
        );
        return;
    }
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    logger.error(
        addColor(`TS Error ${diagnostic.code}`, 'gray'),
        `${diagnostic.file.fileName} (${line + 1}:${character + 1})`,
        ':',
        ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
    );
};

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
const reportWatchStatusChanged = (diagnostic: ts.Diagnostic) => {
    logger.info(ts.formatDiagnostic(diagnostic, formatHost));
};

export const tsWatcher = (context: string, configName?: string): void => {
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

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    const host = ts.createWatchCompilerHost(
        configParseResult.fileNames,
        configParseResult.options,
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged
    );

    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames: ReadonlyArray<string> | undefined, options, _host, oldProgram) => {
        return origCreateProgram(rootNames, options, _host, oldProgram);
    };

    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = (program) => {
        origPostProgramCreate!(program);
    };

    ts.createWatchProgram(host);
};
