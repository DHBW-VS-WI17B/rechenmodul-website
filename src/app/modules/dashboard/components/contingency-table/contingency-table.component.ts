import { Component, OnInit } from '@angular/core';
import { ContingencyTableService } from '../../services';

@Component({
    selector: 'app-contingency-table',
    templateUrl: './contingency-table.component.html',
    styleUrls: ['./contingency-table.component.scss'],
})
export class ContingencyTableComponent implements OnInit {
    constructor(private contingencyTableService: ContingencyTableService) {}

    ngOnInit() {}
}
