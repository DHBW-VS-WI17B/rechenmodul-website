import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICalculationResult } from '../../interfaces';
import { CalculationService } from '../calculation/calculation.service';

@Injectable({
    providedIn: 'root',
})
export class ResultService {
    constructor(private calculationService: CalculationService) {}

    public get result$(): Observable<ICalculationResult | undefined> {
        return this.calculationService.calculate$;
    }
}
