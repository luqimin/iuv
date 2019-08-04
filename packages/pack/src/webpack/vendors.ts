import { IMEPackConfig } from '../const/config';

export default (config: IMEPackConfig) => {
    return {
        common: Array.isArray(config.dll) ? config.dll : [],
        production: [],
        development: [],
    };
};
