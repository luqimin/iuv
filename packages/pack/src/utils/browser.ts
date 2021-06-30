import { isSupported } from 'caniuse-api';

/**
 * 判断是否支持老旧浏览器
 */
export const isSupportStupidBrowsers = (browsers: string | string[]) => {
    const support = isSupported('const', browsers);
    return support;
};
