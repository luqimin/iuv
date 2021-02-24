/**
 * 服务端静态文件(ejs等)打包
 */
import * as Path from 'path';
import * as fs from 'fs-extra';
import klawSync from 'klaw-sync';
import anymatch from 'anymatch';

import { IUVPackOptions } from '../const/config';
import { STATIC_FILES_IGNORE } from '../const/filename';

export const serverStaticCompiler = (options: IUVPackOptions): Promise<void[]> => {
    const dir = options.serverSourcePath!;
    const dest = options.serverPath!;
    const files = klawSync(dir, {
        nodir: true,
        filter: ({ path, stats }) => {
            const basename = Path.basename(path);
            const extname = Path.extname(path);

            // 忽略隐藏文件
            if (basename !== '.' && basename[0] === '.') {
                return false;
            }

            // 忽略ts文件
            if (extname === '.ts' || extname === '.tsx') {
                return false;
            }

            return !(anymatch as any)(STATIC_FILES_IGNORE, path);
        },
    });

    const copyPromises: Promise<void>[] = files.map(({ path }) => {
        const relPath: string = Path.relative(dir, path);
        const newPath: string = Path.resolve(dest, relPath);
        return fs.copy(path, newPath);
    });

    return Promise.all(copyPromises);
};
