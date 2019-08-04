/**
 * webpack dev server 配置
 */
export default {
    common: {},
    production: {},
    development: {
        host: '127.0.0.1',
        port: 8080,
        disableHostCheck: true,
        stats: 'minimal',
    },
};
