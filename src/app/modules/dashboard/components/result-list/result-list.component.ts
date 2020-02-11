import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IResultListItem } from '../../interfaces';
import { ResultListService } from '../../services';

@Component({
    selector: 'app-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/** @class ResultListComponent */
export class ResultListComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    displayedColumns: string[] = ['name', 'value'];
    listItems: IResultListItem[] = [];
    /**
     * @param  {ResultListService} privateresultListService
     * @param  {ChangeDetectorRef} privatechangeDetection
     */
    constructor(private resultListService: ResultListService, private changeDetection: ChangeDetectorRef) {}

    ngOnInit() {
        this.init();
    }

    /**
     * Unsuscribe from Pointobservable
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * Suscribes to the PointObservable and set result list items
     */
    private init(): void {
        this.resultListService.items$.pipe(takeUntil(this.isDestroyed$)).subscribe(items => {
            this.listItems = items;
            this.changeDetection.markForCheck();
        });
    }

    /**
     * Returns true if the given value is a number
     * @param  {any} value
     * @returns {boolean}
     */
    public isNumber(value: any): boolean {
        if (_.isNumber(value)) {
            return true;
        }
        return false;
    }
}
