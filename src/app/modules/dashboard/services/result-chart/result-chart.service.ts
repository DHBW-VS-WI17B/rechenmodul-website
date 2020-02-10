import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICalculationResult } from '../../interfaces';
import { IResultGraphItem } from '../../interfaces/result-graph-item';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
export class ResultChartService {
    constructor(private resultService: ResultService) {}

    public get items$(): Observable<IResultGraphItem> {
        return this.resultService.result$.pipe(map(result => this.convertCalculationResultToResultGraphItem(result)));
    }

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
