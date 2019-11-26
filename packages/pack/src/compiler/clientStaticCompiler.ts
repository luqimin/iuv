/**
 * 客户端静态文件(image等)打包
 */
import * as Path from 'path';
import * as fs from 'fs-extra';
import * as klawSync from 'klaw-sync';
import * as anymatch from 'anymatch';
import * as imagemin from 'imagemin';
import * as imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import { IMEPackOptions } from '../const/config';
import { STATIC_FILES_IGNORE } from '../const/filename';
import { Env } from '../webpack/env';

export const clinetStaticCompiler = (options: IMEPackOptions): Promise<void[]> => {
    const dir = options.clientSourcePath!;
    const dest = options.clientPath!;
    const files = klawSync(dir, {
        nodir: true,
        filter: ({ path, stats }) => {
            const basename = Path.basename(path);
            const extname = Path.extname(path);

            // 忽略隐藏文件
            if (basename !== '.' && basename[0] === '.') {
                return false;
            }

            // 忽略需要编译文件
            if (
                extname === '.js' ||
                extname === '.ts' ||
                extname === '.tsx' ||
                extname === '.css' ||
                extname === '.scss' ||
                extname === '.less'
            ) {
                return false;
            }

            return !(anymatch as any)(STATIC_FILES_IGNORE, path);
        },
    });

    const copyPromises: Array<Promise<any>> = files.map(({ path }) => {
        const relPath: string = Path.relative(dir, path);
        const relFullpath: string = Path.resolve(dir, path);
        const newPath: string = Path.resolve(dest, relPath);
        const newDir: string = Path.dirname(newPath);
        const extname = Path.extname(relPath);
        // 生产环境压缩图片
        if (
            Env.isProductuction &&
            (extname === '.png' || extname === '.jpg' || extname === '.gif' || extname === '.jpeg' || extname === '.svg')
        ) {
            return imagemin([relFullpath], {
                destination: newDir,
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.6, 0.8],
                    }),
                ],
            });
        } else {
            return fs.copy(path, newPath);
        }
    });

    return Promise.all(copyPromises);
};
