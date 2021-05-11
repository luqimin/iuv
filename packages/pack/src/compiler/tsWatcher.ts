/**
 * typescript watcher
 */

import * as fs from 'fs-extra';
import ts from 'typescript';

import getConfigPath from '../typescript/getConfigFile';
import logger, { addColor } from '../utils/logger';

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (p) => p,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};

const reportDiagnostic = (diagnostic: ts.Diagnostic): void => {
    if (!diagnostic.file) {
        logger.error(
            addColor(`TS Error ${diagnostic.code}`, 'gray'),
            ':',
            ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()),
        );
        return;
    }
    logger.log(ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost));
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
    const configParseResult = ts.parseJsonConfigFileContent(fs.readJsonSync(configPath, { encoding: 'utf8' }), ts.sys, context);

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    const host = ts.createWatchCompilerHost(
        configParseResult.fileNames,
        configParseResult.options,
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged,
    );

    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames: ReadonlyArray<string> | undefined, options, h, oldProgram) => {
        return origCreateProgram(rootNames, options, h, oldProgram);
    };

    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = (program) => {
        origPostProgramCreate!(program);
    };

    ts.createWatchProgram(host);
};
