import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
/** @class ValidationService. */
export class ValidationService {
    constructor() {}

    /**
     * Validates a string using regex
     * @param  {string} regExp Regex to validate the string
     * @param  {string} value string to validate
     * @returns  {boolean} Returns true if the string is valid
     */
    public validate(regExp: string, value: string): boolean {
        const regExpObj: RegExp = new RegExp(regExp);
        return regExpObj.test(value);
    }
}
