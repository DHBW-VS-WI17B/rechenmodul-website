import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
/** @class ValidationService. */
export class ValidationService {
    constructor() {}

    /**
     * validates a inout string using regex
     * @param  {string} regExp Regex to validate the string
     * @param  {string} value string to validate
     */
    public validate(regExp: string, value: string): boolean {
        const regExpObj: RegExp = new RegExp(regExp);
        return regExpObj.test(value);
    }
}
