import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoint } from '../../interfaces';
import { IPointValue } from '../../interfaces/point-value';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
export class PointSequenceService {
    constructor(private pointsService: PointsService) {}

    public get points$(): Observable<IPoint[]> {
        return this.pointsService.points$;
    }

    public addPoint(value: IPointValue): void {
        this.pointsService.addPoints([value]);
    }

    public removePoints(points: IPoint[]): void {
        this.pointsService.removePoints(points);
    }

    public updatePoint(point: IPoint): void {
        this.pointsService.updatePoints([point]);
    }
}
