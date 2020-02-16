import { Injectable } from '@angular/core';
import { Config } from '@app/config';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IContingencyTable, IPoint } from '../../interfaces';
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

    public setTable(table: IContingencyTable): void {
        const points = this.convertContingencyTableToPoints(table);
        this.pointsService.setPoints(points);
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
            const indexOfValueX = _.findIndex(table.x, x => x === point.x);
            const indexOfValueY = _.findIndex(table.y, y => y === point.y);
            if (indexOfValueX === -1) {
                if (table.x === undefined) {
                    table.x = [];
                }
                table.x.push(point.x);
            }
            if (indexOfValueY === -1) {
                if (table.y === undefined) {
                    table.y = [];
                }
                table.y.push(point.y);
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

    private convertContingencyTableToPoints(contingencyTable: IContingencyTable): IPoint[] {
        const pointValues: IPoint[] = [];
        for (let i = 0; i < contingencyTable.h.length; i++) {
            const x = contingencyTable.x[i];
            if (x === undefined) {
                continue;
            }
            for (let j = 0; j < contingencyTable.h[i].length; j++) {
                const y = contingencyTable.y[j];
                const h = contingencyTable.h[i][j];
                if (y === undefined || h === undefined) {
                    continue;
                }
                _.times(h, () => {
                    const pointValue: IPoint = {
                        x: x,
                        y: y,
                    };
                    pointValues.push(pointValue);
                });
            }
        }
        return pointValues;
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
}
