import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FileImportService } from '../../services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    constructor(private fileImportService: FileImportService) {}

    ngOnInit() {}

    public openFileDialog(): void {
        const elm = document.getElementById('file_input');
        if (!elm) {
            return;
        }
        elm.click();
        elm.addEventListener('change', event => this.importFile(event), false);
    }

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
}
