import * as path from 'path';

const getName = (_path: string, disableLowercase?: boolean) => {
    const name  = path.basename(_path);
    const filename = name.replace(/.[jt]s(x)?/, '');
    return disableLowercase ? filename : filename.toLocaleLowerCase();
};

export default getName;
