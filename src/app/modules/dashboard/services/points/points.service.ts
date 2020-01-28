import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPoint } from '../../interfaces';
import { IPointValue } from '../../interfaces/point-element';

@Injectable({
    providedIn: 'root',
})
export class PointsService {
    private pointsSubj: BehaviorSubject<IPoint[]> = new BehaviorSubject([]);
    private nextPointId: number = 0;

    constructor() {}

    public setPoints(points: IPoint[]): void {
        this.pointsSubj.next(points);
    }

    public addPoint(value: IPointValue): void {
        const pointsArr = this.getPoints();
        const point: IPoint = {
            id: this.nextPointId++,
            value: value,
        };
        pointsArr.push(point);
        this.setPoints(pointsArr);
    }

    public removePointById(id: number): void {
        const currentPointsArr = this.getPoints();
        const updatedPointsArr = _.remove(currentPointsArr, point => {
            return point.id === id;
        });
        this.setPoints(updatedPointsArr);
    }

    public updatePointById(id: number, value: IPointValue): void {
        const pointsArr = this.getPoints();
        const indexOfPoint = _.findIndex(pointsArr, point => {
            return point.id === id;
        });
        const updatedPoint: IPoint = {
            id: id,
            value: value,
        };
        pointsArr.splice(indexOfPoint, 1, updatedPoint);
        this.setPoints(pointsArr);
    }

    public getPoints(): IPoint[] {
        const points = this.pointsSubj.getValue();
        return points;
    }

    public get points$(): Observable<IPoint[]> {
        const points = this.pointsSubj.asObservable();
        return points;
    }
}
