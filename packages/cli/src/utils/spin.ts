/**
 * cli spinner
 */

import * as CLI from 'clui';

const Spinner = CLI.Spinner;

export interface SpinnerIns {
    start(): void;
    message(text: string): void;
    stop(): void;
}

export default (text: string): SpinnerIns =>
    new Spinner(text, ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
