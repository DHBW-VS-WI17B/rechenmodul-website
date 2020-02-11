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
/** @class ResultListService. */
export class ResultListService {
    /**
     * Creates a instance of the service
     * @param  {ResultService} ResultService
     */
    constructor(private resultService: ResultService) {}

    /**
     * gets the converted ResultList as Observable
     * @returns {Observable<IResultListItem[]>}
     */
    public get items$(): Observable<IResultListItem[]> {
        return this.resultService.result$.pipe(map(result => this.convertCalculationResultToResultListItems(result)));
    }

    /**
     * converts the CalculationResult to ResultListItems
     * @param  {ICalculationResult|undefined} result
     * @returns {IResultListItem[]}
     */
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
        if (!result.points.every((val, _i, arr) => val.x == arr[0].x && val.y == arr[0].y)) {
            if (result.correlationCoefficient !== undefined) {
                listItems.push({ name: 'Korrelationskoeffizient', value: result.correlationCoefficient });
            }
            if (result.regressionGraph !== undefined) {
                listItems.push({
                    name: 'Qualität der Regressionsgerade (Bestimmtheitsmaß)',
                    value: `${this.getQualityInWords(result.regressionGraph.quality)} (${this.formatNumber(
                        result.regressionGraph.quality,
                    )})`,
                });
                listItems.push({ name: 'Gleichung der Regressionsgerade', value: this.getRegressionGraphEquation(result.regressionGraph) });
            }
        }

        return listItems;
    }
    /**
     * get the RegressionGraph equation
     * @param  {IRegressionGraph} regressionGraph
     * @returns {string}
     */
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

    /**
     * returns the qualitiy in words
     * @param  {number} quality
     * @returns {string}
     */
    private getQualityInWords(quality: number): string {
        if (quality >= 0 && quality < 0.5) {
            return 'Ungenügende Qualität';
        }
        if (quality >= 0.5 && quality < 0.7) {
            return 'Mäßige Qualität';
        }
        if (quality >= 0.7 && quality < 0.9) {
            return 'Gute Qualität';
        }
        if (quality >= 0.9 && quality <= 1) {
            return 'Ausgezeichnete Qualität';
        }
        return '';
    }

    /**
     * format a number to only two decimal places
     * @param  {number} value
     * @returns {string}
     */
    private formatNumber(value: number): string {
        return formatNumber(value, Config.APP_LOCALE);
    }
}
