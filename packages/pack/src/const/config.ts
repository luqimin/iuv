/**
 * pack示例参数接口
 */
export interface IUVPackOptions {
    /**
     * pack工作目录（上下文）
     */
    readonly context: string;

    /**
     * 前端client源码目录
     */
    clientSourcePath?: string;

    /**
     * 服务端server源码目录
     */
    serverSourcePath?: string;

    /**
     * 前端client打包后目录
     */
    clientPath?: string;

    /**
     * 服务端server打包后目录
     */
    serverPath?: string;
}

/**
 * pack额外参数接口
 */
export interface IUVPackConfig {
    /**
     * 打印调试日志
     */
    debug?: boolean;

    /**
     * 版本号，生产环境编译时，静态文件名将会携带版本号
     */
    version?: string;

    /**
     * webpack output.publicPath
     */
    publicPath?: string;

    /**
     * 兼容浏览器列表
     */
    browsers?: string[];

    /**
     * 生成es6代码
     */
    newEra?: boolean;

    /**
     * 是否创建唯一的输出文件名
     */
    disableUniqueOutput?: boolean;

    /**
     * webpack dllPlugin vendors
     */
    dll?: string[];

    /**
     * webpack dllPlugin output filename
     */
    dllOutputSuffix?: string;

    /**
     * less modifyVars配置
     */
    lessModifyVars?: { [key: string]: string };

    /**
     * ssr开关
     */
    ssr?: SSR;
}

interface SSR {
    enable: boolean;
    type?: 'react' | 'vue';
}

/**
 * pack默认配置参数
 */
export const DEFAULT_OPTIONS: IUVPackOptions = {
    /**
     * 上下文选取当前程序运行路径
     */
    context: process.cwd(),
};

/**
 * 继承自iuv或者额外设置的配置内容（用于覆盖pack内置webpack、babel配置）
 */
export const DEFAULT_PACK_CONFIG: IUVPackConfig = {
    browsers: ['last 2 version'],
};
