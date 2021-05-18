import path from 'path';

import express from 'express';

import mock from './middleware/mock';

const initServer = (rootPath: string) => {
    const app = express();

    const mockPath = path.resolve(rootPath, './mock');

    app.set('view cache', false);

    app.use('/mock', mock(mockPath));

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const err = new Error('文件路径不存在,无法mock这个请求');
        (err as any).status = 404;
        next(err);
    });

    app.use((err: any, req: express.Request, res: express.Response) => {
        res.status(err.status || 500);
        res.writeHead(200, {
            'Content-Language': 'zh-CN',
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'max-age=0',
            Server: 'iuv',
            'X-Powered-By': 'iuv',
        });
        res.end(`<h1>错误码：${err.status || 500}</h1>
        <h2 style="color:red">${err.message}</h2>
        <h2>请求方式：${req.method}</h2>
        <h2>请求路径：${req.url}</h2>
        <h3>错误stack：</h3>
        <div>${err.stack}</div>`);
    });

    return app;
};

export default initServer;
