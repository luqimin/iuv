/**
 * 获取入口js/css文件版本号
 */
import { IMEPackConfig } from '../const/config';

export const getVersion = (config: IMEPackConfig) => {
    return config.version ? config.version : '[hash:4]';
};
