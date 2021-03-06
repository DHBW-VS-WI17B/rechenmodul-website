import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import * as _ from 'lodash';
import { FileImportService, PointsService } from '../../services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/** @class Base DashboardComponent */
export class DashboardComponent implements OnInit {
    public activeTabIndex: number = 0;

    /**
     * @param  {FileImportService} fileImportService
     * @param  {PointsService} pointsService
     */
    constructor(private fileImportService: FileImportService, private pointsService: PointsService) {}

    ngOnInit() {}

    /**
     * Changes the active tab
     * @param  {MatTabChangeEvent} event
     */
    public changeTab(event: MatTabChangeEvent): void {
        this.activeTabIndex = event.index || 0;
    }

    /**
     * Opens the file dialog of the explorer to import a specific file
     */
    public openFileDialog(): void {
        const elm = document.getElementById('file_input');
        if (!elm) {
            return;
        }
        elm.click();
        elm.addEventListener('change', event => this.importFile(event), false);
    }

    /**
     * Imports a csv file
     * @param  {Event} event
     */
    private importFile(event: Event): void {
        const target = event.target as any;
        if (!target) {
            return;
        }
        const file: Blob | undefined = _.first(target.files);
        if (!file) {
            return;
        }
        this.fileImportService.importFile(file);
    }

    /**
     * Deletes all points out of the list
     */
    public reset(): void {
        this.pointsService.setPoints([]);
    }
}
