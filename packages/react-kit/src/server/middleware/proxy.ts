import { Options } from 'http-proxy-middleware/dist/types';

const { createProxyMiddleware } = require('http-proxy-middleware');

export default createProxyMiddleware;

export { Options };
