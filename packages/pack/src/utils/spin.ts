/**
 * cli spinner
 */

import { Spinner } from 'clui';

import logger from './logger';
import { isDevDquipment } from './platform';

export interface SpinnerIns {
    start(): void;
    message(text: string): void;
    stop(): void;
}

/**
 * 生产环境不打印动画
 */
class PrintOnly {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    public start(): void {
        logger.info(this.text);
    }
    public message(): void {}
    public stop(): void {}
}

export default (text: string): SpinnerIns => {
    if (!isDevDquipment) {
        return new PrintOnly(text);
    }
    return new Spinner(text, ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
};
