import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResultService {
    private resultSubj: BehaviorSubject<any> = new BehaviorSubject(undefined);

    constructor() {}

    public setResult(result: any): void {
        this.resultSubj.next(result);
    }

    public getPoints(): any {
        const result = this.resultSubj.getValue();
        return result;
    }

    public get result$(): Observable<any> {
        const result = this.resultSubj.asObservable();
        return result;
    }
}
