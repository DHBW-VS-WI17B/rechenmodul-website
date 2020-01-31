import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoint } from '../../interfaces';
import { IPointValue } from '../../interfaces/point-element';
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
        this.pointsService.addPoint(value);
    }
}
