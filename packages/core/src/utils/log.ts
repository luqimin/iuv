/**
 * repl日志封装
 */
import chalk from 'chalk';
import * as moment from 'moment';

export const prefix = (): string => {
    return chalk.magenta(`[${moment().format('HH:mm:ss')}]`) + chalk.blue('[iuv] ');
};

export const logger = {
    info(text: string): void {
        console.log(prefix() + chalk.cyan(text));
    },
    success(text: string): void {
        console.log(prefix() + chalk.greenBright(text));
    },
    warn(text: string): void {
        console.log(prefix() + chalk.yellow(text));
    },
    error(text: string): void {
        console.log(prefix() + chalk.red(text));
    },
    debug(text: string): void {
        process.env.NODE_ENV === 'prodcution' && console.log(prefix() + chalk.bgCyanBright.bold('[调试]') + ` ${text}`);
    },
};

export default logger;
