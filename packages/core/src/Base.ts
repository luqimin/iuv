/**
 * iuv任务基类
 */

import { getProjectInfo, IUVProject, IUVProjectConfig } from './dependencies/getRootConfig';
import logger from './utils/log';
import { readFile } from './utils/readFile';

/**
 * willRun运行结果
 */
export type willRunResult = any;
/**
 * running运行结果
 */
export type runningResult = any;
/**
 * didRun运行结果
 */
export type didRunResult = any;

/**
 * 记录iuv运行各阶段的数据
 */
export interface Runtime extends IUVProject {
    /**
     * willRun()运行结果
     */
    willRun?: willRunResult;
    /**
     * running()运行结果
     */
    running?: runningResult;
    /**
     * didRun()运行结果
     */
    didRun?: didRunResult;
    /**
     * 任务执行耗时
     */
    duration?: number;
}

export abstract class BaseClass<P = undefined> {
    public config: IUVProjectConfig;
    public runtime: Runtime;
    public params: P;

    /**
     * 控制台打印日志方法
     */
    public logger: typeof logger = logger;

    /**
     * 获取文件内容方法
     */
    public readFile: typeof readFile = readFile;

    constructor(params?: P) {
        this.params = params!;
        // 初始化项目配置
        this._init();
    }

    /**
     * 初始化任务, 获取iuv配置
     */
    private _init(): void {
        // 获取根目录配置
        try {
            const root = getProjectInfo(this.params && (this.params as any).root);

            // 将iuv相关路径写进环境变量
            process.env.IME_ROOT_PATH = root.rootPath;
            process.env.IUV_ROOT_PATH = root.rootPath;

            this.runtime = Object.assign({}, root);
            this.config = Object.assign({}, root.config);
        } catch (error) {
            throw new Error(`获取iuv配置失败: ${error.message}`);
        }
    }
    /**
     * async _init()执行后的钩子，可以在这里对iuv配置做进一步处理
     */
    protected didInit?(): boolean | void | Promise<boolean | void>;

    /**
     * 开始运行task之前，async()执行如果返回false ，则任务中断
     */
    protected willRun?(): Promise<willRunResult> | willRunResult | boolean | void;

    /**
     * 运行task，这里定义task内容
     */
    protected running?(): Promise<runningResult> | runningResult | void;

    /**
     * 运行task结束
     */
    protected didRun?(): Promise<didRunResult> | didRunResult | void;

    /**
     * 开始执行任务
     */
    public async start(): Promise<any> {
        // 记录任务开始时间
        const startTime: number = new Date().getTime();

        // 初始化相关配置后增加一个钩子，返回false则任务中断
        if (this.didInit && (await this.didInit()) === false) {
            process.exit(0);
        }

        // willRun...
        this.runtime.willRun = this.willRun && (await this.willRun());
        if (this.runtime.willRun === false) {
            process.exit(0);
        }

        // running...
        this.runtime.running = this.running && (await this.running());

        // 记录任务结束时间
        const endTime: number = new Date().getTime();
        // 计算任务耗时
        const spendTime = endTime - startTime;
        this.runtime.duration = spendTime;

        // didRun...
        this.runtime.didRun = this.didRun && (await this.didRun());

        return this.runtime.running;
    }
}
