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
export class ResultListComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    displayedColumns: string[] = ['name', 'value'];
    listItems: IResultListItem[] = [];

    constructor(private resultListService: ResultListService, private changeDetection: ChangeDetectorRef) {}

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    private init(): void {
        this.resultListService.items$.pipe(takeUntil(this.isDestroyed$)).subscribe(items => {
            this.listItems = items;
            this.changeDetection.markForCheck();
        });
    }

    public isNumber(value: any): boolean {
        if (_.isNumber(value)) {
            return true;
        }
        return false;
    }
}
