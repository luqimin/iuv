import { IMEPackConfig, IMEPackOptions, Pack } from '@iuv/pack';

export default (runtime: IMEPackOptions, config: IMEPackConfig) => {
    return new Pack(
        {
            context: runtime.context!,
            clientPath: runtime.clientPath,
            clientSourcePath: runtime.clientSourcePath,
            serverPath: runtime.serverPath,
            serverSourcePath: runtime.serverSourcePath,
        },
        config
    );
};
