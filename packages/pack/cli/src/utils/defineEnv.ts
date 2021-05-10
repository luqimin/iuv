export default (env?: any) => {
    switch (env) {
        case 'd':
        case 'dev':
        case 'develop':
        case 'development':
            process.env.NODE_ENV = 'development';
            break;
        case 'p':
        case 'pro':
        case 'prod':
        case 'product':
        case 'production':
            process.env.NODE_ENV = 'production';
            break;
        default:
            process.env.NODE_ENV = 'development';
            break;
    }
};
