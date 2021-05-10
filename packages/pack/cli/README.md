## IUV cli 使用说明

### install

```shell
npm i -g @iuv/cli
```

### 内置功能: 新建项目

```shell
# 在当前目录创建并初始化项目
i init [project]
```

### 自定义命令调用方法

1. 在 `iuv.config.js` 中配置相关命令
2. `i cmd1` 或 `i exec cmd2` 或者携带参数 `i cmd3 -e dev --bool`
3. arg参数将传递给命令class类的 `this.params` 参数

### iuv.config.js demo

```javascript
module.export = {
    commands: {
        cmd1: {
            path: '/path/to/cmdClass', // 模块绝对路径
        },
        cmd2: {
            package: 'cmdPackage', // 模块npm 包名
        },
        cmd3: {
            package: 'cmdPackage',
            /**
             * 模块运行arg参数
             * @example
             * // this.params = { env:dev, bool: true, person: ['a', 'b']  }
             * i cmd3 -e dev --bool -p a -p b
             * @see https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
             **/
            args: [
                { name: 'env', alias: 'e', type: String },
                { name: 'dd', type: Number },
                { name: 'bool', type: Boolean },
                { name: 'person', alias: 'p', type: String, multiple: true },
            ],
        },
    },
};
```
