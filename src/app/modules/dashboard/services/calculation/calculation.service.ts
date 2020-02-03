import { Injectable } from '@angular/core';
import { IPoint } from '../../interfaces';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
export class CalculationService {
    constructor(private resultService: ResultService) {}

    public calculate(points: IPoint[]): void {
        // TODO calculate
        const calculationResult = undefined;
        this.resultService.setResult(calculationResult);
    }
}
