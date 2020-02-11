import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoint } from '../../interfaces';
import { IPointValue } from '../../interfaces/point-value';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
/** @class PointSequenceService. */
export class PointSequenceService {
    /**
     * Creates instance of the service
     * @param  {PointsService} privatepointsService
     */
    constructor(private pointsService: PointsService) {}

    /**
     * Gets all Points
     * @returns {Observable<IPoint[]>}
     */
    public get points$(): Observable<IPoint[]> {
        return this.pointsService.points$;
    }

    /**
     * Adds a Point to Observable
     * @param  {IPointValue} value
     */
    public addPoint(value: IPointValue): void {
        this.pointsService.addPoints([value]);
    }

    /**
     * Removes points from Observable
     * @param  {IPoint[]} points
     */
    public removePoints(points: IPoint[]): void {
        this.pointsService.removePoints(points);
    }

    /**
     * Update specific point to Observable
     * @param  {IPoint} point
     */
    public updatePoint(point: IPoint): void {
        this.pointsService.updatePoints([point]);
    }

    /**
     * get number of different points in the whole list of points
     * @param  {IPoint[]} points
     * @returns {number}
     */
    public getNumberOfDifferentPointValues(points: IPoint[]): number {
        return this.pointsService.getNumberOfDifferentPointValues(points);
    }
}
