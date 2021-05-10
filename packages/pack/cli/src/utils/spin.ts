/**
 * cli spinner
 */

import { Spinner } from 'clui';

export interface SpinnerIns {
    start(): void;
    message(text: string): void;
    stop(): void;
}

export default (text: string): SpinnerIns => new Spinner(text, ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
