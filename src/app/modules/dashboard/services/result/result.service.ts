import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICalculationResult } from '../../interfaces';
import { CalculationService } from '../calculation/calculation.service';

@Injectable({
    providedIn: 'root',
})
/** @class ResultService. */
export class ResultService {
    /**
     * Create Instance of the Service
     * @param  {CalculationService} CalculationService
     */
    constructor(private calculationService: CalculationService) {}

    /**
     * Gets CalculationResult as observable
     * @returns {Observable<ICalculationResult | undefined>}
     */
    public get result$(): Observable<ICalculationResult | undefined> {
        return this.calculationService.calculate$;
    }
}
