import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContingencyTableValueType } from '../../enum';
import { IContingencyTable } from '../../interfaces';
import { ContingencyTableService } from '../../services';

@Component({
    selector: 'app-contingency-table',
    templateUrl: './contingency-table.component.html',
    styleUrls: ['./contingency-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContingencyTableComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public table: IContingencyTable | undefined = undefined;

    public readonly VALUE_TYPE_X = ContingencyTableValueType.x;
    public readonly VALUE_TYPE_Y = ContingencyTableValueType.y;
    public readonly VALUE_TYPE_H = ContingencyTableValueType.h;
    public readonly VALUE_TYPE_HX = ContingencyTableValueType.hx;
    public readonly VALUE_TYPE_HY = ContingencyTableValueType.hy;
    public readonly VALUE_TYPE_HXY = ContingencyTableValueType.hxy;

    constructor(private contingencyTableService: ContingencyTableService, private changeDetection: ChangeDetectorRef) {}

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    private init(): void {
        this.contingencyTableService.table$.pipe(takeUntil(this.isDestroyed$)).subscribe(table => {
            this.table = table;
            this.changeDetection.markForCheck();
        });
    }

    public getValueFor(valueType: ContingencyTableValueType, index1: number, index2: number | undefined): number | undefined {
        let value = undefined;
        if (this.table === undefined) {
            return value;
        }
        switch (valueType) {
            case this.VALUE_TYPE_X:
                value = this.table.x[index1];
                break;
            case this.VALUE_TYPE_Y:
                value = this.table.y[index1];
                break;
            case this.VALUE_TYPE_H:
                if (this.table.h[index1] === undefined || index2 === undefined) {
                    return value;
                }
                value = this.table.h[index1][index2];
                break;
        }
        return value;
    }

    public updateValueFor(valueType: ContingencyTableValueType, updatedValue: number, index1: number, index2: number | undefined): void {
        if (this.table === undefined) {
            return;
        }
        switch (valueType) {
            case this.VALUE_TYPE_X: {
                const currentValue = this.table.x[index1];
                this.table.x[index1] = updatedValue;
                this.contingencyTableService.updateValueTypeX(currentValue, updatedValue);
                break;
            }
            case this.VALUE_TYPE_Y: {
                const currentValue = this.table.y[index1];
                this.table.y[index1] = updatedValue;
                this.contingencyTableService.updateValueTypeY(currentValue, updatedValue);
                break;
            }
            case this.VALUE_TYPE_H: {
                if (this.table.h[index1] === undefined || index2 === undefined) {
                    break;
                }
                const currentValue = this.table.h[index1][index2];
                this.contingencyTableService.updateValueTypeH(this.table.x[index1], this.table.y[index2], currentValue, updatedValue);
                break;
            }
        }
    }

    public getPlaceholderFor(valueType: ContingencyTableValueType, index1: number | undefined, index2: number | undefined) {
        let placeholder = '';
        switch (valueType) {
            case this.VALUE_TYPE_X:
                placeholder = `x${this.toUnicodeSubscript(index1)}`;
                break;
            case this.VALUE_TYPE_Y:
                placeholder = `y${this.toUnicodeSubscript(index1)}`;
                break;
            case this.VALUE_TYPE_H:
                placeholder = `h${this.toUnicodeSubscript(index1)}${this.toUnicodeSubscript(index2)}`;
                break;
            case this.VALUE_TYPE_HX:
                placeholder = `h${this.toUnicodeSubscript(index1)}.`;
                break;
            case this.VALUE_TYPE_HY:
                placeholder = `h.${this.toUnicodeSubscript(index1)}`;
                break;
            case this.VALUE_TYPE_HXY:
                placeholder = `n`;
                break;
        }
        return placeholder;
    }

    public getSumFor(valueType: ContingencyTableValueType, index: number | undefined): number | undefined {
        if (!this.table) {
            return;
        }
        let value = undefined;
        switch (valueType) {
            case this.VALUE_TYPE_HX: {
                if (index === undefined) {
                    return;
                }
                value = _.sum(this.table.h[index]);
                break;
            }
            case this.VALUE_TYPE_HY: {
                if (index === undefined) {
                    return;
                }
                const itemsForSum = _.map(this.table.h, itemRow => {
                    return itemRow[index];
                });
                value = _.sum(itemsForSum);
                break;
            }
            case this.VALUE_TYPE_HXY: {
                const itemsForSum = _.map(this.table.h, itemRow => {
                    return _.sum(itemRow);
                });
                value = _.sum(itemsForSum);
                break;
            }
        }
        return value;
    }

    public trackByFn(index: number, item: number | undefined) {
        return index;
    }

    private toUnicodeSubscript(num: number | undefined): string {
        if (num === undefined) return '';
        const numAsString = num.toString();
        let result = '';
        [...numAsString].forEach(c => {
            switch (c) {
                case '0':
                    result += '₀';
                    break;
                case '1':
                    result += '₁';
                    break;
                case '2':
                    result += '₂';
                    break;
                case '3':
                    result += '₃';
                    break;
                case '4':
                    result += '₄';
                    break;
                case '5':
                    result += '₅';
                    break;
                case '6':
                    result += '₆';
                    break;
                case '7':
                    result += '₇';
                    break;
                case '8':
                    result += '₈';
                    break;
                case '9':
                    result += '₉';
                    break;

                default:
                    break;
            }
        });
        return result;
    }
}
