/**
 * postcss插件
 */
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import { Env } from './env';
import { IUVPackConfig } from '../const/config';

const getPlugins = (config: IUVPackConfig) => {
    const postcssPlugins: any[] = [
        autoprefixer({
            env: Env.env,
        }),
    ];

    if (Env.isProductuction) {
        // 生产环境添加css压缩功能
        postcssPlugins.push(
            cssnano({
                preset: ['default', { cssDeclarationSorter: false }],
            })
        );
    }
    return postcssPlugins;
};

export default getPlugins;
