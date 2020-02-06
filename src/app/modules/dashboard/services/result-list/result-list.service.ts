import { Injectable } from '@angular/core';
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
        listItems.push({ name: 'Varianz (x)', value: result.variance.x.toString() });
        listItems.push({ name: 'Varianz (y)', value: result.variance.y.toString() });
        listItems.push({ name: 'Kovarianz', value: result.covariance.toString() });
        listItems.push({ name: 'Korrelationskoeffizient', value: result.correlationCoefficient.toString() });
        return listItems;
    }
}
