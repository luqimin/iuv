import { logger } from './logger';

export default (moduleId: string) => {
    let modulePath: string, moduleObj: any;
    try {
        modulePath = require.resolve(moduleId);

        if (!modulePath) return null;
        moduleObj = require(modulePath);

        if (!moduleObj) return moduleObj;

        // es module
        if (moduleObj.__esModule) {
            return 'default' in moduleObj ? moduleObj.default : moduleObj;
        }

        return moduleObj;
    } catch (error) {
        logger.error(error);
        return null;
    }
};
