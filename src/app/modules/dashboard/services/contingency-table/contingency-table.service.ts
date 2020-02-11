import { Injectable } from '@angular/core';
import { Config } from '@app/config';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IContingencyTable, IPoint, IPointValue } from '../../interfaces';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
/** @class ContingencyTableService. */
export class ContingencyTableService {
    /**
     * creates a instance of the service
     * @param  {PointsService} PointsService
     */
    constructor(private pointsService: PointsService) {}

    /**
     * returns Contingency table as observable
     * @returns {Observable<IContingencyTable>}
     */
    public get table$(): Observable<IContingencyTable> {
        return this.pointsService.points$.pipe(
            map(points => {
                return this.convertPointsToContingencyTable(points);
            }),
        );
    }

    /**
     * convert Points to contingency table
     * @param  {IPoint[]} points
     * @returns {IContingencyTable}
     */
    private convertPointsToContingencyTable(points: IPoint[]): IContingencyTable {
        let table: IContingencyTable = {
            y: [],
            x: [],
            h: [],
        };
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const indexOfValueX = _.findIndex(table.x, x => x === point.value.x);
            const indexOfValueY = _.findIndex(table.y, y => y === point.value.y);
            if (indexOfValueX === -1) {
                if (table.x === undefined) {
                    table.x = [];
                }
                table.x.push(point.value.x);
            }
            if (indexOfValueY === -1) {
                if (table.y === undefined) {
                    table.y = [];
                }
                table.y.push(point.value.y);
            }
            if (indexOfValueX === -1 || indexOfValueY === -1) {
                i--;
                continue;
            }
            if (table.h[indexOfValueX] === undefined) {
                table.h[indexOfValueX] = [];
            }
            table.h[indexOfValueX][indexOfValueY] = (table.h[indexOfValueX][indexOfValueY] || 0) + 1;
        }
        table = this.fillEmptyCells(table);
        return table;
    }

    /**
     * fills the empty cells of the table
     * @param  {IContingencyTable} table
     * @returns {IContingencyTable}
     */
    private fillEmptyCells(table: IContingencyTable): IContingencyTable {
        const maxDifferentValues = Config.MAX_NUMBER_OF_DIFFERENT_POINT_VALUES;
        const maxRowLength = table.x.length + 1 > maxDifferentValues ? maxDifferentValues : table.x.length + 1;
        const maxColumnLength = table.y.length + 1 > maxDifferentValues ? maxDifferentValues : table.y.length + 1;
        for (let i = 0; i < maxRowLength; i++) {
            const rowHasValue = table.x[i] === undefined ? false : true;
            if (!rowHasValue) {
                table.x[i] = undefined;
            }
            for (let j = 0; j < maxColumnLength; j++) {
                const columnHasValue = table.y[j] === undefined ? false : true;
                if (!columnHasValue) {
                    table.y[j] = undefined;
                }
                if (table.h[i] === undefined) {
                    table.h[i] = [];
                }
                if (columnHasValue && rowHasValue && table.h[i][j] === undefined) {
                    table.h[i][j] = 0;
                } else if (table.h[i][j] === undefined) {
                    table.h[i][j] = undefined;
                }
            }
        }
        return table;
    }

    /**
     * updates y value
     * @param  {number|undefined} currentValue
     * @param  {number|undefined} updatedValue
     */
    public updateValueTypeY(currentValue: number | undefined, updatedValue: number | undefined): void {
        if (currentValue === undefined) {
            return;
        }
        const currentPointValue: IPointValue<number | undefined> = {
            x: undefined,
            y: currentValue,
        };
        const points = this.pointsService.getPointsByValue(currentPointValue);
        if (updatedValue === undefined) {
            this.pointsService.removePoints(points);
        } else {
            for (const point of points) {
                point.value.y = updatedValue;
            }
            this.pointsService.updatePoints(points);
        }
    }

    /**
     * updates x value
     * @param  {number|undefined} currentValue
     * @param  {number|undefined} updatedValue
     */
    public updateValueTypeX(currentValue: number | undefined, updatedValue: number | undefined): void {
        if (currentValue === undefined) {
            return;
        }
        const currentPointValue: IPointValue<number | undefined> = {
            x: currentValue,
            y: undefined,
        };
        const points = this.pointsService.getPointsByValue(currentPointValue);
        if (updatedValue === undefined) {
            this.pointsService.removePoints(points);
        } else {
            for (const point of points) {
                point.value.x = updatedValue;
            }
            this.pointsService.updatePoints(points);
        }
    }

    /**
     * updates frequency of point with x and y value
     * @param  {number|undefined} x
     * @param  {number|undefined} y
     * @param  {number|undefined} currentValue
     * @param  {number|undefined} updatedValue
     */
    public updateValueTypeH(
        x: number | undefined,
        y: number | undefined,
        currentValue: number | undefined,
        updatedValue: number | undefined,
    ): void {
        if (x === undefined || y === undefined) {
            return;
        }
        if (updatedValue !== undefined && updatedValue > Config.MAX_SAMPLE_SIZE) {
            updatedValue = Config.MAX_SAMPLE_SIZE;
        }
        if (currentValue !== undefined && currentValue > Config.MAX_SAMPLE_SIZE) {
            currentValue = Config.MAX_SAMPLE_SIZE;
        }
        if (currentValue === undefined) {
            currentValue = 0;
        }
        if (updatedValue === undefined) {
            updatedValue = 0;
        }
        const diff = Math.abs(currentValue - updatedValue);
        const pointValue: IPointValue = {
            x: x,
            y: y,
        };
        if (currentValue <= updatedValue) {
            this.pointsService.addPointMultipleTimes(pointValue, diff);
        } else if (currentValue > updatedValue) {
            this.pointsService.removePointsByValueMultipleTimes(pointValue, diff);
        }
    }
}
