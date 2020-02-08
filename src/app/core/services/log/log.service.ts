import { Injectable } from '@angular/core';
import { LogLevel } from '@app/core/enums';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    private readonly TAG = '[LogService]';

    constructor() {}

    public log(level: LogLevel, tag: string, message: string, objN: any[]): void {
        const fullMessage = `${tag} ${message}`;
        switch (level) {
            case LogLevel.debug:
                console.debug(fullMessage, ...objN);
                break;
            case LogLevel.log:
                console.log(fullMessage, ...objN);
                break;
            case LogLevel.warn:
                console.warn(fullMessage, ...objN);
                break;
            case LogLevel.error:
                console.error(fullMessage, ...objN);
                break;
            default:
                this.log(LogLevel.error, this.TAG, 'LogLevel not found.', []);
        }
    }
}
