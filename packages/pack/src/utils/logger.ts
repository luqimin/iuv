/**
 * repl日志封装
 */
import chalk from 'chalk';
import getTime from './time';
import { isDevDquipment } from './platform';

export const addColor = (text: string, color: string) => {
    if (isDevDquipment) {
        return (chalk as any)[color](text);
    } else {
        return text;
    }
};

export const prefix = (): string => {
    return addColor(`[${getTime()}]`, 'magenta') + addColor('[iuv]', 'blue');
};

const logger = {
    info(...args: Array<string | number>): void {
        console.log(prefix(), ...args.map((text) => addColor(String(text), 'cyan')));
    },
    success(...args: Array<string | number>): void {
        console.log(prefix(), ...args.map((text) => addColor(String(text), 'greenBright')));
    },
    warn(...args: Array<string | number>): void {
        console.log(prefix(), ...args.map((text) => addColor(String(text), 'yellow')));
    },
    error(...args: Array<string | number>): void {
        console.log(prefix(), ...args.map((text) => addColor(String(text), 'red')));
    },
    log(...args: string[]): void {
        console.log(...args);
    },
};

export default logger;
