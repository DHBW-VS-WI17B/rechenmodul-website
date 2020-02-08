import { Injectable } from '@angular/core';
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
            const values = line.split(';');
            const x = values[0];
            const y = values[1];
            if (!isNaN(+x) && !isNaN(+y)) {
                const pointValue: IPointValue = {
                    x: Number(x),
                    y: Number(y),
                };
                pointValues.push(pointValue);
            }
        }
        return pointValues;
    }

    private setPoints(pointValues: IPointValue[]): void {
        this.pointsService.setPoints([]);
        this.pointsService.addPoints(pointValues);
    }
}
