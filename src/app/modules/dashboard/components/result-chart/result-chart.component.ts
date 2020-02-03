import { Component, OnInit } from '@angular/core';
import { ResultChartService } from '../../services';

@Component({
    selector: 'app-result-chart',
    templateUrl: './result-chart.component.html',
    styleUrls: ['./result-chart.component.scss'],
})
export class ResultChartComponent implements OnInit {
    constructor(private resultChartService: ResultChartService) {}

    ngOnInit() {}
}
