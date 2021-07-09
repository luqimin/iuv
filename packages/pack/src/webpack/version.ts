/**
 * 获取入口js/css文件版本号
 */
import { IUVPackConfig } from '../const/config';

export const getVersion = (config: IUVPackConfig) => {
    return config.version ? config.version : '[contenthash:8]';
};
