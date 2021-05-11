import { IUVPackConfig, IUVPackOptions, Pack } from '@iuv/pack';

export default (runtime: IUVPackOptions, config: IUVPackConfig) => {
    return new Pack(
        {
            context: runtime.context!,
            clientPath: runtime.clientPath,
            clientSourcePath: runtime.clientSourcePath,
            serverPath: runtime.serverPath,
            serverSourcePath: runtime.serverSourcePath,
        },
        config,
    );
};
