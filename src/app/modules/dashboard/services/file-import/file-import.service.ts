import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IPointValue } from '../../interfaces';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
export class FileImportService {
    constructor(private pointsService: PointsService) {}

    public async importFile(file: Blob): Promise<void> {
        const text = await this.getFileContentAsText(file);
        const pointValues = this.parseCSVToPointValues(text);
        this.setPoints(pointValues);
    }

    private getFileContentAsText(file: Blob): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(<string>reader.result);
            };
            reader.readAsText(file);
        });
        return promise;
    }

    private parseCSVToPointValues(csv: string): IPointValue[] {
        const lines = csv.split('\n');
        const pointValues: IPointValue[] = [];
        for (const line of lines) {
            let values = line.split(';');
            values = _.map(values, value => value.replace(',', '.'));
            const x = Number(values[0]);
            const y = Number(values[1]);
            if (isNaN(x) || isNaN(y)) {
                continue;
            }
            const pointValue: IPointValue = {
                x: x,
                y: y,
            };
            pointValues.push(pointValue);
        }
        return pointValues;
    }

    private setPoints(pointValues: IPointValue[]): void {
        this.pointsService.reset();
        this.pointsService.addPoints(pointValues);
    }
}
