const path = require('path');
const assert = require('assert');

const { getProjectInfo } = require('../lib');

const cwd = process.cwd(),
    wd1 = path.resolve(__dirname, 'example1');

describe('dependencies/getRootConfig.ts', () => {
    it('默认获取当前运行目录信息', () => {
        const p = getProjectInfo();
        assert.strictEqual(p.rootPath, cwd);
    });

    it('传递目录参数，获取该目录下项目配置信息', () => {
        const p1 = getProjectInfo(wd1);
        const _config = require(path.resolve(wd1, 'iuv.config.js'))

        assert.strictEqual(p1.rootPath, wd1);
        assert.strictEqual(p1.config, _config);
    });
});
