import { IUVPackConfig } from '../const/config';

export default (config: IUVPackConfig) => {
    return {
        common: Array.isArray(config.dll) ? config.dll : [],
        production: [],
        development: [],
    };
};
