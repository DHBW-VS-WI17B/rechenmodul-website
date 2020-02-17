import { Injectable } from '@angular/core';
import { Config } from '@app/config';
import { LogLevel } from '@app/core/enums';
import { LogService } from '@app/core/services';
import { NotificationService } from '@app/shared';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPoint } from '../../interfaces';
import { ValidationService } from '../validation/validation.service';

@Injectable({
    providedIn: 'root',
})
/** @class PointsService. */
export class PointsService {
    private readonly TAG = '[PointsService]';
    private pointsSubj: BehaviorSubject<IPoint[]> = new BehaviorSubject<IPoint[]>([]);

    /**
     * Creates the service instance
     * @param  {ValidationService} ValidationService
     * @param  {LogService} LogService
     * @param  {NotificationService} notificationService
     */
    constructor(
        private validationService: ValidationService,
        private logService: LogService,
        private notificationService: NotificationService,
    ) {}

    /**
     * Sets new points
     * @param  {IPoint[]} points
     */
    public setPoints(points: IPoint[]): void {
        const valid = this.validatePoints(points);
        if (!valid) {
            return;
        }
        this.logService.log(LogLevel.debug, this.TAG, 'Set points.', [points]);
        this.pointsSubj.next(points);
    }

    /**
     * Gets all points as observable
     *  @returns {Observable<IPoint[]>}
     */
    public get points$(): Observable<IPoint[]> {
        const points = this.pointsSubj.asObservable();
        return points;
    }

    /**
     * Validates the given points
     * @param  {IPoint[]} points
     * @returns {boolean} Returns true if all points have valid values
     */
    private validatePoints(points: IPoint[]): boolean {
        this.logService.log(LogLevel.debug, this.TAG, 'Validate points.', []);
        // Validate sample size
        if (points.length > Config.MAX_SAMPLE_SIZE) {
            this.notificationService.showNotification({
                message: `Fehlgeschlagen: Maximaler Stichprobenumfang von ${Config.MAX_SAMPLE_SIZE} überschritten!`,
            });
        }
        if (points.length > Config.MAX_SAMPLE_SIZE) {
            this.logService.log(LogLevel.warn, this.TAG, 'Sample size too large.', [points.length]);
            return false;
        }
        // Validate number of different point values
        const numberOfDifferentPoints = this.getNumberOfDifferentPoints(points);
        if (numberOfDifferentPoints > Config.MAX_NUMBER_OF_DIFFERENT_POINT_VALUES) {
            this.notificationService.showNotification({
                message:
                    `Fehlgeschlagen: Maximaler Umfang von ${Config.MAX_NUMBER_OF_DIFFERENT_POINT_VALUES} ` +
                    `verschiedenen Punkten überschritten!`,
            });
        }
        if (numberOfDifferentPoints > Config.MAX_NUMBER_OF_DIFFERENT_POINT_VALUES) {
            this.logService.log(LogLevel.warn, this.TAG, 'Number of different point values too large.', [numberOfDifferentPoints]);
            return false;
        }
        // Validate point values
        let allPointsValid = true;
        for (const point of points) {
            const valid = this.validatePoint(point);
            if (!valid) {
                this.logService.log(LogLevel.warn, this.TAG, 'Invalid point value found.', [point]);
                allPointsValid = false;
            }
        }
        if (!allPointsValid) {
            this.notificationService.showNotification({
                message: `Fehlgeschlagen: Invalide Eingabe.`,
            });
            return false;
        }
        return true;
    }

    /**
     * Get number of different points in the subject
     * @param  {IPoint[]} points
     * @returns {number}
     */
    public getNumberOfDifferentPoints(points: IPoint[]): number {
        const differentPoints: IPoint[] = [];
        for (const point of points) {
            const index = _.findIndex(differentPoints, pointValue => {
                return pointValue.x === point.x && pointValue.y === point.y;
            });
            if (index < 0) {
                differentPoints.push(point);
            }
        }
        return differentPoints.length;
    }

    /**
     * Validates a point
     * @param  {IPointValue} pointValue
     * @returns {boolean} Returns true if the point is valid
     */
    private validatePoint(pointValue: IPoint): boolean {
        const xIsValid = this.validatePointValueNumber(pointValue.x) && Math.abs(pointValue.x) <= Number.MAX_SAFE_INTEGER;
        const yIsValid = this.validatePointValueNumber(pointValue.y) && Math.abs(pointValue.y) <= Number.MAX_SAFE_INTEGER;
        return xIsValid && yIsValid;
    }

    /**
     * Validates a point value number
     * @param  {number} value of the point
     * @returns {boolean} Returns true if the point value number is valid
     */
    private validatePointValueNumber(value: number): boolean {
        return this.validationService.validate(Config.REGEX_POINT_VALUE_NUMBER, value.toString());
    }
}
