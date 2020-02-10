import { Injectable } from '@angular/core';
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
        listItems.push({ name: 'Eindimensionaler Mittelwert (x)', value: result.oneDimensionalMean.x.toString() });
        listItems.push({ name: 'Eindimensionaler Mittelwert (y)', value: result.oneDimensionalMean.y.toString() });
        if (result.variance !== undefined) {
            listItems.push({ name: 'Varianz (x)', value: result.variance.x.toString() });
            listItems.push({ name: 'Varianz (y)', value: result.variance.y.toString() });
        }
        if (result.covariance !== undefined) {
            listItems.push({ name: 'Kovarianz', value: result.covariance.toString() });
        }
        if (result.correlationCoefficient !== undefined) {
            listItems.push({ name: 'Korrelationskoeffizient', value: result.correlationCoefficient.toString() });
        }
        if (result.regressionGraph !== undefined) {
            listItems.push({ name: 'Qualität der Regressionsgerade (Bestimmtheitsmaß)', value: result.regressionGraph.quality.toString() });
            listItems.push({ name: 'Gleichung der Regressionsgerade', value: this.getRegressionGraphEquation(result.regressionGraph) });
        }
        return listItems;
    }

    private getRegressionGraphEquation(regressionGraph: IRegressionGraph): string {
        if (regressionGraph.xAxisSection !== undefined) {
            return `x = ${regressionGraph.xAxisSection}`;
        } else if (regressionGraph.yAxisSection !== undefined) {
            if (regressionGraph.incline == 0) {
                return `y = ${regressionGraph.yAxisSection}`;
            } else {
                return `y = ${regressionGraph.incline} * x + ${regressionGraph.yAxisSection}`;
            }
        }
        return '-';
    }
}
