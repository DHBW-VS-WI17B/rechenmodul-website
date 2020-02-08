import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    constructor() {}

    public validate(regExp: string, value: string): boolean {
        const regExpObj: RegExp = new RegExp(regExp);
        return regExpObj.test(value);
    }
}
