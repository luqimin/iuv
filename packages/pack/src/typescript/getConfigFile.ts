import * as path from 'path';
import ts = require('typescript');

export default (context: string, filename: string = 'tsconfig.json'): string => {
    let configPath: string;
    // 默认获取项目自定义配置文件
    const _projectConfigPath: string | undefined = ts.findConfigFile(context, ts.sys.fileExists, filename);

    // 是否存在typescript配置文件
    if (_projectConfigPath) {
        configPath = _projectConfigPath;
    } else {
        configPath =
            ts.findConfigFile(path.resolve(__dirname, '../../json/'), ts.sys.fileExists, filename) ||
            ts.findConfigFile(path.resolve(__dirname, '../../json/'), ts.sys.fileExists, 'tsconfig.default.json')!;
    }

    return configPath;
};
