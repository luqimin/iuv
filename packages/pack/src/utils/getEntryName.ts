import * as path from 'path';

const getName = (p: string, disableLowercase?: boolean) => {
    const name = path.basename(p);
    const filename = name.replace(/.[jt]s(x)?/, '');
    return disableLowercase ? filename : filename.toLocaleLowerCase();
};

export default getName;
