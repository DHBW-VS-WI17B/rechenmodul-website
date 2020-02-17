import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoint } from '../../interfaces';
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
     * Gets the points observable
     * @returns {Observable<IPoint[]>}
     */
    public get points$(): Observable<IPoint[]> {
        return this.pointsService.points$;
    }

    /**
     * Gets all points
     * @param  {IPoint[]} points
     */
    public setPoints(points: IPoint[]): void {
        this.pointsService.setPoints(points);
    }

    /**
     * Get number of different points in the whole list of points
     * @param  {IPoint[]} points
     * @returns {number}
     */
    public getNumberOfDifferentPoints(points: IPoint[]): number {
        return this.pointsService.getNumberOfDifferentPoints(points);
    }
}
