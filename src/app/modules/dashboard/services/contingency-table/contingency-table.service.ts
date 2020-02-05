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
export class ContingencyTableService {
    constructor(private pointsService: PointsService) {}

    public get table$(): Observable<IContingencyTable> {
        return this.pointsService.points$.pipe(
            map(points => {
                return this.convertPointsToContingencyTable(points);
            }),
        );
    }

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

    private fillEmptyCells(table: IContingencyTable): IContingencyTable {
        for (let i = 0; i < Config.CONTINGENCY_TABLE_MAX_ROWS; i++) {
            const rowHasValue = table.x[i] === undefined ? false : true;
            if (!rowHasValue) {
                table.x[i] = undefined;
            }
            for (let j = 0; j < Config.CONTINGENCY_TABLE_MAX_COLUMNS; j++) {
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

    public updateValueTypeY(currentValue: number | undefined, updatedValue: number | undefined): void {
        if (currentValue === undefined) {
            return;
        }
        const points = this.pointsService.getPoints();
        for (const point of points) {
            if (point.value.y !== currentValue) {
                continue;
            }
            if (updatedValue === undefined) {
                this.pointsService.removePointById(point.id);
            } else {
                const pointValue: IPointValue = {
                    x: point.value.x,
                    y: updatedValue,
                };
                this.pointsService.updatePointById(point.id, pointValue);
            }
        }
    }

    public updateValueTypeX(currentValue: number | undefined, updatedValue: number | undefined): void {
        if (currentValue === undefined) {
            return;
        }
        const points = this.pointsService.getPoints();
        for (const point of points) {
            if (point.value.x !== currentValue) {
                continue;
            }
            if (updatedValue === undefined) {
                this.pointsService.removePointById(point.id);
            } else {
                const pointValue: IPointValue = {
                    x: updatedValue,
                    y: point.value.y,
                };
                this.pointsService.updatePointById(point.id, pointValue);
            }
        }
    }

    public updateValueTypeH(
        x: number | undefined,
        y: number | undefined,
        currentValue: number | undefined,
        updatedValue: number | undefined,
    ): void {
        if (x === undefined || y === undefined) {
            return;
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
        if (currentValue < updatedValue) {
            _.times(diff, () => {
                this.pointsService.addPoint(pointValue);
            });
        } else if (currentValue > updatedValue) {
            _.times(diff, () => {
                this.pointsService.removePointByValue(pointValue);
            });
        }
    }
}
