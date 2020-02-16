import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Config } from '@app/config';
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

/** @class ContingencyTableComponent. */
export class ContingencyTableComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public table: IContingencyTable | undefined = undefined;
    @ViewChild('contingencyTableForm', { static: false }) contingencyTableForm: ElementRef<HTMLFormElement> | undefined;

    public readonly VALUE_TYPE_X = ContingencyTableValueType.x;
    public readonly VALUE_TYPE_Y = ContingencyTableValueType.y;
    public readonly VALUE_TYPE_H = ContingencyTableValueType.h;
    public readonly VALUE_TYPE_HX = ContingencyTableValueType.hx;
    public readonly VALUE_TYPE_HY = ContingencyTableValueType.hy;
    public readonly VALUE_TYPE_HXY = ContingencyTableValueType.hxy;

    public readonly MAX_SAMPLE_SIZE = Config.MAX_SAMPLE_SIZE;

    /**
     * @param  {ContingencyTableService} ContingencyTableService
     * @param  {ChangeDetectorRef} ChangeDetection
     */
    constructor(private contingencyTableService: ContingencyTableService, private changeDetection: ChangeDetectorRef) {}

    ngOnInit() {
        this.init();
    }

    /**
     * Unsubscribe from the PointObservable
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * Suscribes to the PointObservable
     */
    private init(): void {
        this.contingencyTableService.table$.pipe(takeUntil(this.isDestroyed$)).subscribe(table => {
            this.table = table;
            this.changeDetection.markForCheck();
        });
    }

    public saveTable(table: IContingencyTable): void {
        if (!this.contingencyTableForm) {
            return;
        }
        const formValid = this.contingencyTableForm.nativeElement.checkValidity();
        if (!formValid) {
            return;
        }
        this.contingencyTableService.setTable(table);
    }

    /**
     * gets the value for a specific type out of the array on [index1][index2]
     * @param  {ContingencyTableValueType} valueType Type if x-Value, y-Value or frequency
     * @param  {number} index1
     * @param  {number|undefined} index2
     * @returns {number | undefined}
     */
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

    /**
     * updates the value for a specific type in the array on [index1][index2]
     * @param  {ContingencyTableValueType} valueType Type if x-Value, y-Value or frequency
     * @param  {number|undefined|null} updatedValue new value
     * @param  {number} index1
     * @param  {number|undefined} index2
     */
    public updateValueFor(
        valueType: ContingencyTableValueType,
        updatedValue: number | undefined | null,
        index1: number,
        index2: number | undefined,
    ): void {
        if (this.table === undefined) {
            return;
        }
        if (updatedValue === null || _.isNaN(updatedValue)) {
            updatedValue = undefined;
        }
        const currentValue = this.getValueFor(valueType, index1, index2);
        switch (valueType) {
            case this.VALUE_TYPE_X:
                this.table.x[index1] = updatedValue;
                break;
            case this.VALUE_TYPE_Y:
                this.table.y[index1] = updatedValue;
                break;
            case this.VALUE_TYPE_H:
                if (this.table.h[index1] === undefined || index2 === undefined) {
                    break;
                }
                this.table.h[index1][index2] = updatedValue;
                if (currentValue === undefined) {
                    if (this.table.x[this.table.x.length - 1] !== undefined) {
                        this.table.x.push(undefined);
                        this.table.h[this.table.h.length] = _.fill(Array(this.table.y.length), undefined);
                    }
                    if (this.table.y[this.table.y.length - 1] !== undefined) {
                        this.table.y.push(undefined);
                        this.table.h[index1].push(undefined);
                    }
                }
                break;
        }
    }

    /**
     * gets the placeholder for a specific type out of the array on [index1][index2]
     * @param  {ContingencyTableValueType} valueType
     * @param  {number|undefined} index1
     * @param  {number|undefined} index2
     * @returns {string}
     */
    public getPlaceholderFor(valueType: ContingencyTableValueType, index1: number | undefined, index2: number | undefined): string {
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

    /**
     * gets the total frequency for a specific type
     * @param  {ContingencyTableValueType} valueType HX = Frequency X-Value, HY = Frequency Y-Value, HXY = Frequency Points
     * @param  {number|undefined} index
     * @returns {number | undefined}
     */
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

    /**
     * Track by in ngFor for a better performance
     * @param  {number} index
     * @param  {number|undefined} item
     * @returns {number}
     */
    public trackByFn(index: number, item: number | undefined): number {
        return index;
    }

    /**
     * Convert number to unicode subscript text
     * @param  {number|undefined} num
     * @returns {string}
     */
    private toUnicodeSubscript(num: number | undefined): string {
        if (num === undefined) {
            return '';
        }
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
