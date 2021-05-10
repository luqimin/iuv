import commandLineArgs from 'command-line-args';

const getArgType = (value: string): ((input: string) => any) => {
    if (['true'].includes(value)) {
        return Boolean;
    }
    if (!isNaN(value as any)) {
        return Number;
    }
    return String;
};

export const getOptions = (args: commandLineArgs.OptionDefinition[]) => {
    // 获取命令参数
    const mainDefinitions = [{ name: 'command', defaultOption: true }];
    const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
    const argv = mainOptions._unknown || [];

    let cmdArgsDefinition = args;

    // 当配置文件中没有配置args配置参数时，程序根据argv猜测参数
    if (!Array.isArray(cmdArgsDefinition) || !cmdArgsDefinition.length) {
        const len = argv.length,
            paramsCache: { [key: string]: commandLineArgs.OptionDefinition } = {};
        for (let i = 0; i < len; i++) {
            const arg = argv[i];
            let nextArg = argv[i + 1];

            if (arg.startsWith('--')) {
                // arg参数以'--'开头，肯定是一个Boolean或者String或者Number
                let param = arg.split('--')[1];
                if (!param) continue;

                // 如果参数带等号
                if (param.includes('=')) {
                    const [leftKey, rightValue] = param.split('=');
                    param = leftKey;
                    nextArg = rightValue;
                }

                // 重复参数
                if (paramsCache[param]) {
                    paramsCache[param].multiple = true;
                    continue;
                }

                if (!nextArg || nextArg.startsWith('-')) {
                    // param是boolean
                    paramsCache[param] = { name: param, type: Boolean };
                } else if (nextArg && !nextArg.startsWith('-')) {
                    paramsCache[param] = { name: param, type: getArgType(nextArg) };
                }
            } else if (arg.startsWith('-')) {
                let param = arg.split('-')[1];
                if (!param) continue;

                if (param.includes('=')) {
                    const [leftKey, rightValue] = param.split('=');
                    param = leftKey;
                    nextArg = rightValue;
                }

                // 重复参数
                if (paramsCache[param]) {
                    paramsCache[param].multiple = true;
                    continue;
                }

                if (!nextArg || nextArg.startsWith('-')) {
                    // param是boolean
                    paramsCache[param] = { name: param, alias: param, type: Boolean };
                } else if (nextArg && !nextArg.startsWith('-')) {
                    paramsCache[param] = { name: param, alias: param, type: getArgType(nextArg) };
                }
            }
        }

        cmdArgsDefinition = Object.values(paramsCache);
    }

    // 获取命令后的配置参数
    const cmdOptions = commandLineArgs(cmdArgsDefinition, { argv, partial: true });

    return cmdOptions;
};
