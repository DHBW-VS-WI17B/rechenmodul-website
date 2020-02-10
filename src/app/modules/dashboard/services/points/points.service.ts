import { Injectable } from '@angular/core';
import { Config } from '@app/config';
import { LogLevel } from '@app/core/enums';
import { LogService } from '@app/core/services';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPoint, IPointValue } from '../../interfaces';
import { ValidationService } from '../validation/validation.service';

@Injectable({
    providedIn: 'root',
})
export class PointsService {
    private readonly TAG = '[PointsService]';
    private pointsSubj: BehaviorSubject<IPoint[]> = new BehaviorSubject<IPoint[]>([]);
    private nextPointId: number = 0;

    constructor(private validationService: ValidationService, private logService: LogService) {}

    public setPoints(points: IPoint[]): void {
        const valid = this.validatePoints(points);
        if (!valid) {
            return;
        }
        this.logService.log(LogLevel.debug, this.TAG, 'Set points.', [points]);
        this.pointsSubj.next(points);
    }

    public reset(): void {
        this.logService.log(LogLevel.debug, this.TAG, 'RESET.', []);
        this.setPoints([]);
        this.nextPointId = 0;
    }

    public addPointMultipleTimes(pointValue: IPointValue, times: number): void {
        const pointValues: IPointValue[] = [];
        for (let i = 0; i < times; i++) {
            pointValues.push(pointValue);
        }
        this.addPoints(pointValues);
    }

    public addPoints(values: IPointValue[]): void {
        const pointsArr = this.getPoints();
        for (const value of values) {
            const point: IPoint = {
                id: this.nextPointId++,
                value: {
                    x: value.x,
                    y: value.y,
                },
            };
            pointsArr.push(point);
        }
        this.setPoints(pointsArr);
    }

    public removePoints(pointsToRemove: IPoint[]): void {
        const points = this.getPoints();
        const ids = _.map(pointsToRemove, pointToRemove => pointToRemove.id);
        _.remove(points, point => {
            return ids.includes(point.id);
        });
        this.setPoints(points);
    }

    public removePointsByValueMultipleTimes(pointValue: IPointValue, times: number): void {
        const points = this.getPoints();
        const pointsToRemove: IPoint[] = [];
        for (const point of points) {
            const pointFound = point.value.x === pointValue.x && point.value.y === pointValue.y;
            if (!pointFound) {
                continue;
            }
            if (pointsToRemove.length >= times) {
                break;
            }
            pointsToRemove.push(point);
        }
        this.removePoints(pointsToRemove);
    }

    public updatePoints(updatedPoints: IPoint[]): void {
        if (updatedPoints.length < 1) {
            return;
        }
        const points = this.getPoints();
        for (const updatedPoint of updatedPoints) {
            const indexOfPoint = _.findIndex(points, point => {
                return point.id === updatedPoint.id;
            });
            if (indexOfPoint < 0) {
                continue;
            }
            points[indexOfPoint].value = {
                x: updatedPoint.value.x,
                y: updatedPoint.value.y,
            };
        }
        this.setPoints(points);
    }

    private getPoints(): IPoint[] {
        const points = this.pointsSubj.getValue();
        return _.cloneDeep(points);
    }

    public getPointsByValue(value: IPointValue<number | undefined>): IPoint[] {
        const points = this.getPoints();
        const pointsByValue: IPoint[] = [];
        for (const point of points) {
            if (value.x !== undefined && point.value.x !== value.x) {
                continue;
            }
            if (value.y !== undefined && point.value.y !== value.y) {
                continue;
            }
            pointsByValue.push(point);
        }
        return pointsByValue;
    }

    public get points$(): Observable<IPoint[]> {
        const points = this.pointsSubj.asObservable();
        return points;
    }

    private validatePoints(points: IPoint[]): boolean {
        this.logService.log(LogLevel.debug, this.TAG, 'Validate points.', []);
        // Validate sample size
        if (points.length > Config.MAX_SAMPLE_SIZE) {
            this.logService.log(LogLevel.warn, this.TAG, 'Sample size too large.', [points.length]);
            return false;
        }
        // Validate number of different point values
        const numberOfDifferentPointValues = this.getNumberOfDifferentPointValues(points);
        if (numberOfDifferentPointValues > Config.MAX_NUMBER_OF_DIFFERENT_POINT_VALUES) {
            this.logService.log(LogLevel.warn, this.TAG, 'Number of different point values too large.', [numberOfDifferentPointValues]);
            return false;
        }
        // Validate point values
        for (const point of points) {
            const valid = this.validatePointValue(point.value);
            if (!valid) {
                this.logService.log(LogLevel.warn, this.TAG, 'Invalid point value found.', [point]);
                return false;
            }
        }
        return true;
    }

    private getNumberOfDifferentPointValues(points: IPoint[]): number {
        const differentPointValues: IPointValue[] = [];
        for (const point of points) {
            const index = _.findIndex(differentPointValues, pointValue => {
                return pointValue.x === point.value.x && pointValue.y === point.value.y;
            });
            if (index < 0) {
                differentPointValues.push(point.value);
            }
        }
        return differentPointValues.length;
    }

    private validatePointValue(pointValue: IPointValue): boolean {
        const xIsValid = this.validatePointValueNumber(pointValue.x) && Math.abs(pointValue.x) <= Number.MAX_SAFE_INTEGER;
        const yIsValid = this.validatePointValueNumber(pointValue.y) && Math.abs(pointValue.y) <= Number.MAX_SAFE_INTEGER;
        return xIsValid && yIsValid;
    }

    private validatePointValueNumber(value: number): boolean {
        return this.validationService.validate(Config.REGEX_POINT_VALUE_NUMBER, value.toString());
    }
}
