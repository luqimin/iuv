import spawn from 'cross-spawn';

/**
 * 安装npm依赖包
 * @param cwd - 运行上下文
 * @param dependencies - 需要安装的所有依赖
 * @param registry - npm registry
 */
const install = (cwd: string, dependencies: string[], registry?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const command: string = 'npm';
        const args: string[] = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);

        if (registry) {
            args.push('--registry');
            args.push(registry);
        }

        const child = spawn(command, args, { cwd, stdio: 'inherit' });
        child.on('close', (code: number) => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
};

export default install;
