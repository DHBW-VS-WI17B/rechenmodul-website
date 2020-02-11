import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICalculationResult } from '../../interfaces';
import { IResultGraphItem } from '../../interfaces/result-graph-item';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
/** @class ResultChartService. */
export class ResultChartService {
    /**
     * Creates a service instance
     * @param  {ResultService} ResultService
     */
    constructor(private resultService: ResultService) {}

    /**
     * Get Resultgraphitem
     * @returns {Observable<IResultGraphItem>}
     */
    public get items$(): Observable<IResultGraphItem> {
        return this.resultService.result$.pipe(map(result => this.convertCalculationResultToResultGraphItem(result)));
    }

    /**
     * convert CalculationResult to ResultGraphItem
     * @param  {ICalculationResult|undefined} result
     * @returns {IResultGraphItem}
     */
    private convertCalculationResultToResultGraphItem(result: ICalculationResult | undefined): IResultGraphItem {
        if (!result) {
            return {
                points: [],
                regressionGraph: {
                    yAxisSection: undefined,
                    xAxisSection: undefined,
                    incline: undefined,
                    quality: 0,
                },
            };
        } else {
            const resultGraphItem: IResultGraphItem = {
                points: result.points,
                regressionGraph: result.regressionGraph || undefined,
            };
            return resultGraphItem;
        }
    }
}
