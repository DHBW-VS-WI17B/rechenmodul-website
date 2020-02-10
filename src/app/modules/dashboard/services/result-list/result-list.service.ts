import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import { Config } from '@app/config';
import { IRegressionGraph } from 'rechenmodul-core/dist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICalculationResult, IResultListItem } from '../../interfaces';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
export class ResultListService {
    constructor(private resultService: ResultService) {}

    public get items$(): Observable<IResultListItem[]> {
        return this.resultService.result$.pipe(map(result => this.convertCalculationResultToResultListItems(result)));
    }

    private convertCalculationResultToResultListItems(result: ICalculationResult | undefined): IResultListItem[] {
        if (!result) {
            return [];
        }
        const listItems: IResultListItem[] = [];
        listItems.push({ name: 'Eindimensionaler Mittelwert (x)', value: result.oneDimensionalMean.x });
        listItems.push({ name: 'Eindimensionaler Mittelwert (y)', value: result.oneDimensionalMean.y });
        if (result.variance !== undefined) {
            listItems.push({ name: 'Varianz (x)', value: result.variance.x });
            listItems.push({ name: 'Varianz (y)', value: result.variance.y });
        }
        if (result.covariance !== undefined) {
            listItems.push({ name: 'Kovarianz', value: result.covariance });
        }
        if (result.correlationCoefficient !== undefined) {
            listItems.push({ name: 'Korrelationskoeffizient', value: result.correlationCoefficient });
        }
        if (result.regressionGraph !== undefined) {
            listItems.push({ name: 'Qualität der Regressionsgerade (Bestimmtheitsmaß)', value: result.regressionGraph.quality });
            listItems.push({ name: 'Gleichung der Regressionsgerade', value: this.getRegressionGraphEquation(result.regressionGraph) });
        }
        return listItems;
    }

    private getRegressionGraphEquation(regressionGraph: IRegressionGraph): string {
        if (regressionGraph.xAxisSection !== undefined) {
            return `x = ${this.formatNumber(regressionGraph.xAxisSection)}`;
        } else if (regressionGraph.yAxisSection !== undefined) {
            if (!regressionGraph.incline) {
                return `y = ${this.formatNumber(regressionGraph.yAxisSection)}`;
            } else {
                return `y = ${this.formatNumber(regressionGraph.incline)} * x + ${this.formatNumber(regressionGraph.yAxisSection)}`;
            }
        }
        return '-';
    }

    private formatNumber(value: number): string {
        return formatNumber(value, Config.APP_LOCALE);
    }
}
