import fs from 'fs';
import path from 'path';
import url from 'url';

import { Request, Response, NextFunction } from 'express';

const mockMiddleware = (rootPath: string) => {
    const mock = (req: Request, res: Response, next: NextFunction) => {
        const mapStr = fs.readFileSync(path.resolve(rootPath, './index.json'), 'utf8');

        if (!mapStr) {
            next();
            return;
        }

        let mapObj;

        try {
            mapObj = JSON.parse(mapStr);
        } catch (error) {
            next(error);
            return;
        }

        let jsonKey: string = url.parse(req.originalUrl).pathname as string;

        jsonKey = jsonKey.replace(/\/mock\//, '');

        const jsonPath = mapObj[jsonKey];

        let dataPath: string = path.resolve(rootPath, `./${jsonPath}`);

        // 支持不写json后缀
        if (!dataPath.includes('.json')) {
            dataPath += '.json';
        }

        if (fs.existsSync(dataPath)) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8',
                'Cache-Control': 'max-age=0',
                Server: 'iuv',
                'X-Powered-By': 'iuv',
            });
            res.end(fs.readFileSync(dataPath));
        } else {
            next();
        }
    };
    return mock;
};

export default mockMiddleware;
