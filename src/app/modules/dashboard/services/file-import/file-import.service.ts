import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IPoint } from '../../interfaces';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
/** @class FileImportService. */
export class FileImportService {
    /**
     * Creates an instance of the service
     * @param  {PointsService} pointsService
     */
    constructor(private pointsService: PointsService) {}

    /**
     * Imports CSV File
     * @param  {Blob} file
     */
    public async importFile(file: Blob): Promise<void> {
        const text = await this.getFileContentAsText(file);
        const points = this.parseCSVToPoints(text);
        this.setPoints(points);
    }

    /**
     * Get the content of the file as string
     * @param  {Blob} file
     */
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

    /**
     * Parses CSV-string to points
     * @param  {string} csv
     * @returns  {IPoint[]}
     */
    private parseCSVToPoints(csv: string): IPoint[] {
        const lines = csv.split('\n');
        const points: IPoint[] = [];
        for (const line of lines) {
            let values = line.split(';');
            values = _.map(values, value => value.replace(',', '.'));
            const x = Number(values[0]);
            const y = Number(values[1]);
            if (isNaN(x) || isNaN(y)) {
                continue;
            }
            const pointValue: IPoint = {
                x: x,
                y: y,
            };
            points.push(pointValue);
        }
        return points;
    }

    /**
     * Set points
     * @param  {IPoint[]} points
     */
    private setPoints(points: IPoint[]): void {
        this.pointsService.setPoints(points);
    }
}
