const path = require('path');
const assert = require('assert');

const { BaseClass } = require('../lib');

// 测试目录
const wd1 = path.resolve(__dirname, 'example1');

class NewBaseClass extends BaseClass {
    constructor(params) {
        super(params);
    }
    willRun() {
        return 'willrun';
    }
    running() {
        return 'running';
    }
    didRun() {
        return { log: 'success', code: 200 };
    }
}

const cmd = new BaseClass({ root: wd1, testParams: 666 }),
    cmd1 = new NewBaseClass({ root: wd1 });

describe('index.ts', () => {
    it('继承自BaseClass', () => {
        assert.ok(cmd instanceof BaseClass);
        assert.ok(cmd1 instanceof BaseClass);
    });

    it('任务实例有logger方法', () => {
        assert.ok(typeof cmd.logger.info === 'function');
        assert.ok(typeof cmd.logger.success === 'function');
        assert.ok(typeof cmd.logger.warn === 'function');
        assert.ok(typeof cmd.logger.error === 'function');
        assert.ok(typeof cmd.logger.debug === 'function');
    });

    it('实例params参数', () => {
        assert.ok(cmd.params.testParams === 666);
    });

    it('实例runtime信息', async () => {
        const _config = require(path.resolve(wd1, 'iuv.config.js'));
        const runningResult = await cmd1.start();

        assert.strictEqual(cmd1.runtime.rootPath, wd1);
        assert.strictEqual(cmd1.runtime.config, _config);
        assert.strictEqual(cmd1.runtime.willRun, 'willrun');
        assert.strictEqual(cmd1.runtime.running, 'running');
        assert.strictEqual(cmd1.runtime.didRun.log, 'success');
        assert.strictEqual(cmd1.runtime.didRun.code, 200);
        assert.strictEqual(runningResult, 'running');
        assert.ok(typeof cmd1.runtime.duration === 'number');
    });

    it('didInit返回false退出任务', (done) => {
        class DidInitFalse extends BaseClass {
            constructor(params) {
                super(params);
            }
            didInit() {
                return false;
            }
        }

        new DidInitFalse().start();

        process.on('exit', (code) => {
            if (code === 0) {
                done();
            } else {
                done(new Error());
            }
        });
    });
});
