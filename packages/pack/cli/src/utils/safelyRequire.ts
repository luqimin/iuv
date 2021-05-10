export default (moduleId: string) => {
    let _modulePath: string, _module: any;
    try {
        _modulePath = require.resolve(moduleId);

        if (!_modulePath) return null;
        _module = require(_modulePath);

        if (!_module) return _module;

        // es module
        if (_module.__esModule) {
            return 'default' in _module ? _module.default : _module;
        }

        return _module;
    } catch (error) {
        return null;
    }
};
